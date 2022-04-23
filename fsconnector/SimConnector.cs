using Microsoft.FlightSimulator.SimConnect;
using MSFSTouchPanel.Shared;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Dynamic;
using System.Runtime.InteropServices;
using System.Timers;

namespace MSFSTouchPanel.FSConnector
{
    public class SimConnector
    {
        private const int MSFS_CONNECTION_RETRY_TIMEOUT = 1000;
        private const int WM_USER_SIMCONNECT = 0x0402;

        private SimConnect _simConnect;
        private MobiFlightWasmClient _mobiFlightWasmClient;
        private Timer _connectionTimer;

        public event EventHandler<EventArgs<string>> OnException;
        public event EventHandler<EventArgs<dynamic>> OnReceivedData;
        public event EventHandler<EventArgs<string>> OnReceiveSystemEvent;
        public event EventHandler OnConnected;
        public event EventHandler OnDisconnected;

        public dynamic SimData { get; set; }

        public bool Connected { get; set; }

        public void Start()
        {
            _connectionTimer = new Timer();
            _connectionTimer.Interval = MSFS_CONNECTION_RETRY_TIMEOUT;
            _connectionTimer.Enabled = true;
            _connectionTimer.Elapsed += (source, e) =>
            {
                try
                {
                    InitializeSimConnect();
                }
                catch (COMException ex)
                {
                    // handle SimConnect instantiation error when MSFS is not connected
                }
            };
        }

        private void HandleOnRecvOpen(SimConnect sender, SIMCONNECT_RECV_OPEN data)
        {
            Connected = true;

            if(_mobiFlightWasmClient != null)
                _mobiFlightWasmClient.Stop();

            _mobiFlightWasmClient = new MobiFlightWasmClient(_simConnect);
            _mobiFlightWasmClient.Initialize();

            AddDataDefinitions();
      
            _mobiFlightWasmClient.Ping();

            OnConnected?.Invoke(this, null);
        }
     
        public void StopAndReconnect()
        {
            Stop();
            _connectionTimer.Enabled = true;
        }

        public bool Stop()
        {
            _mobiFlightWasmClient.Stop();

            if (_simConnect != null)
            {
                // Dispose serves the same purpose as SimConnect_Close()
                _simConnect.Dispose();
                _simConnect = null;
            }

            Connected = true;

            return true;
        }

        public void RequestData()
        {
            if (_simConnect == null || !Connected || !_mobiFlightWasmClient.Connected) 
                return;

            _simConnect.RequestDataOnSimObjectType(DATA_REQUEST.REQUEST_1, SIMCONNECT_DEFINE_ID.Dummy, 0, SIMCONNECT_SIMOBJECT_TYPE.USER);
        }

        public void ReceiveMessage()
        {
            if (_simConnect == null) 
                return;
            
            try
            {
                _simConnect.ReceiveMessage();
            }
            catch (Exception ex)
            {
                if (ex.Message != "0xC00000B0")
                    OnException?.Invoke(this, new EventArgs<string>($"SimConnect receive message exception: {ex.Message}"));
            }
        }

        public void SetSimVar(String simVarCode)
        {
            if (_simConnect == null || !Connected || _mobiFlightWasmClient == null || !_mobiFlightWasmClient.Connected)
                return;

            _mobiFlightWasmClient.SetSimVar(simVarCode);
        }

        public void SetEventID(string eventID, uint value)
        {
            if (_simConnect == null || !Connected || _mobiFlightWasmClient == null || !_mobiFlightWasmClient.Connected)
                return;

            _mobiFlightWasmClient.SetEventID(eventID, value);
        }

        private void InitializeSimConnect()
        {
            // The constructor is similar to SimConnect_Open in the native API
            _simConnect = new SimConnect("Simconnect - Simvar test", Process.GetCurrentProcess().MainWindowHandle, WM_USER_SIMCONNECT, null, 0);

            // Listen to connect and quit msgs
            _simConnect.OnRecvOpen += HandleOnRecvOpen;
            _simConnect.OnRecvQuit += HandleOnRecvQuit;
            _simConnect.OnRecvException += HandleOnRecvException;
            _simConnect.OnRecvEvent += HandleOnReceiveSystemEvent;
            _simConnect.OnRecvSimobjectDataBytype += HandleOnRecvSimobjectDataBytype;

            // Register simConnect system events
            _simConnect.UnsubscribeFromSystemEvent(SystemEvent.SIMSTART);
            _simConnect.SubscribeToSystemEvent(SystemEvent.SIMSTART, "SimStart");
            _simConnect.UnsubscribeFromSystemEvent(SystemEvent.SIMSTOP);
            _simConnect.SubscribeToSystemEvent(SystemEvent.SIMSTOP, "SimStop");

            _connectionTimer.Enabled = false;

            System.Threading.Thread.Sleep(2000);
            ReceiveMessage();
        }

        private void AddDataDefinitions()
        {
            var definitions = DataDefinition.GetDefinition();
            foreach (var (propName, variableName, simConnectUnit, dataType, dataDefinitionType) in definitions)
            {
                switch (dataDefinitionType)
                {
                    case DataDefinitionType.AVar:
                        _mobiFlightWasmClient.GetSimVar($"(A:{variableName})");
                        break;
                    case DataDefinitionType.LVar:
                        _mobiFlightWasmClient.GetSimVar($"(L:{variableName})");
                        break;
                    case DataDefinitionType.SimConnect:
                        SIMCONNECT_DATATYPE simmConnectDataType;
                        switch (dataType)
                        {
                            case DataType.String:
                                simmConnectDataType = SIMCONNECT_DATATYPE.STRING256;
                                break;
                            case DataType.Float64:
                                simmConnectDataType = SIMCONNECT_DATATYPE.FLOAT64;
                                break;
                            default:
                                simmConnectDataType = SIMCONNECT_DATATYPE.FLOAT64;
                                break;
                        }

                        _simConnect.AddToDataDefinition(SIMCONNECT_DATA_DEFINITION.SIMCONNECT_DATA_STRUCT, variableName, simConnectUnit, simmConnectDataType, 0.0f, SimConnect.SIMCONNECT_UNUSED);
                        break;
                }
            }

            // register simConnect data structure
            _simConnect.RegisterDataDefineStruct<SimConnectStruct>(SIMCONNECT_DATA_DEFINITION.SIMCONNECT_DATA_STRUCT);
        }


        private void HandleOnRecvQuit(SimConnect sender, SIMCONNECT_RECV data)
        {
            Stop();
            OnDisconnected?.Invoke(this, null);
        }

        private void HandleOnRecvException(SimConnect sender, SIMCONNECT_RECV_EXCEPTION data)
        {
            SIMCONNECT_EXCEPTION e = (SIMCONNECT_EXCEPTION)data.dwException;

            if (e != SIMCONNECT_EXCEPTION.ALREADY_CREATED)
            {
                Logger.ServerLog("SimConnectCache::Exception " + e.ToString(), LogLevel.ERROR);
            }   
        }

        private void HandleOnRecvSimobjectDataBytype(SimConnect sender, SIMCONNECT_RECV_SIMOBJECT_DATA_BYTYPE data)
        {
            if(_simConnect == null || !Connected || !_mobiFlightWasmClient.Connected) 
                return;

            if(data.dwRequestID != 0)
                Logger.ServerLog($"SimConnect unknown request ID: {data.dwRequestID}", LogLevel.ERROR);

            try
            {
                var simConnectStruct = (SimConnectStruct)data.dwData[0];
                var simConnectStructFields = typeof(SimConnectStruct).GetFields();
                var simData = new ExpandoObject();

                var definition = DataDefinition.GetDefinition();
                int i = 0;
                foreach (var item in definition)
                {
                    switch(item.dataDefinitionType)
                    {
                        case DataDefinitionType.AVar:
                            simData.TryAdd(item.propName, _mobiFlightWasmClient.GetSimVar($"(A:{item.variableName})"));
                            break;
                        case DataDefinitionType.LVar:
                            simData.TryAdd(item.propName, _mobiFlightWasmClient.GetSimVar($"(L:{item.variableName})"));
                            break;
                        case DataDefinitionType.SimConnect:
                            simData.TryAdd(item.propName, simConnectStructFields[i++].GetValue(simConnectStruct));      // increment structure counter after assignment
                            break;
                    }
                }

                SimData = simData;
                OnReceivedData?.Invoke(this, new EventArgs<dynamic>(simData));
            }
            catch (Exception ex)
            {
                Logger.ServerLog($"SimConnect receive data exception: {ex.Message}", LogLevel.ERROR);
            }
        }

        private void HandleOnReceiveSystemEvent(SimConnect sender, SIMCONNECT_RECV_EVENT data)
        {
            var eventId = ((SystemEvent)data.uEventID).ToString();
            OnReceiveSystemEvent?.Invoke(this, new EventArgs<string>(eventId));
        }
    }
}