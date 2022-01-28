using Microsoft.FlightSimulator.SimConnect;
using MSFSTouchPanel.Shared;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Dynamic;
using System.IO;
using System.Runtime.InteropServices;
using System.Timers;

namespace MSFSTouchPanel.FSConnector
{
    public class SimConnector
    {
        private uint MaxClientDataDefinition = 0;
        private const int MSFS_CONNECTION_RETRY_TIMEOUT = 1000;
        private const int MSFS_TRANSMIT_LOCK_TIMEOUT = 50;
        private const string STANDARD_EVENT_GROUP = "STANDARD";
        private const string SIMCONNECT_EVENT_GROUP = "SIMCONNECT_EVENT";
        private const string MOBIFLIGHT_CLIENT_DATA_NAME_SIMVAR = "MobiFlight.LVars";
        private const string MOBIFLIGHT_CLIENT_DATA_NAME_COMMAND = "MobiFlight.Command";
        private const string MOBIFLIGHT_CLIENT_DATA_NAME_RESPONSE = "MobiFlight.Response";
        private const int MOBIFLIGHT_MESSAGE_SIZE = 1024;       // The message size for commands and responses, this has to be changed also in SimConnectDefintions
        private const int WM_USER_SIMCONNECT = 0x0402;
        private object _msfs_transmit_lock = new object();

        private SimConnect _simConnect;
        private bool _connected;
        private Timer _connectionTimer;
        private Dictionary<String, List<Tuple<String, uint>>> _simConnectEvents;

        public event EventHandler<EventArgs<string>> OnException;
        public event EventHandler<EventArgs<dynamic>> OnReceivedData;
        public event EventHandler<EventArgs<string>> OnReceiveSystemEvent;
        public event EventHandler OnConnected;
        public event EventHandler OnDisconnected;
        public event EventHandler LVarListUpdated;

        private List<SimVar> SimVars = new List<SimVar>();
        private List<String> LVars = new List<String>();
        private String ResponseStatus = "NEW";

        public dynamic SimData { get; set; }

        public void Start()
        {
            LoadEventPresets();

            _connectionTimer = new System.Timers.Timer();
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

        public void StopAndReconnect()
        {
            Stop();
            _connectionTimer.Enabled = true;
        }

        public bool Stop()
        {
            MobiFlightWasmClient.Stop(_simConnect);
            ClearSimVars();
            MaxClientDataDefinition = 0;

            if (_simConnect != null)
            {
                // Dispose serves the same purpose as SimConnect_Close()
                _simConnect.Dispose();
                _simConnect = null;
            }
            _connected = false;

            return true;
        }

        public void RequestData()
        {
            if (_simConnect != null)
                try
                {
                    _simConnect.RequestDataOnSimObjectType(DATA_REQUEST.REQUEST_1, SIMCONNECT_DEFINE_ID.Dummy, 0, SIMCONNECT_SIMOBJECT_TYPE.USER);
                }
                catch (Exception ex)
                {
                    if (ex.Message != "0xC00000B0")
                        OnException?.Invoke(this, new EventArgs<string>($"SimConnect request data exception: {ex.Message}"));
                }
        }

        public void ReceiveMessage()
        {
            if (_simConnect != null)
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

        public void SetEventID(string eventID, uint value)
        {
            if (_simConnect == null || !_connected) return;

            Tuple<String, uint> eventItem = null;

            try
            {
                foreach (String GroupKey in _simConnectEvents.Keys)
                {
                    eventItem = _simConnectEvents[GroupKey].Find(x => x.Item1 == eventID);
                    if (eventItem != null) break;
                }

                if (eventItem == null) return;

                if (System.Threading.Monitor.TryEnter(_msfs_transmit_lock))
                {
                    _simConnect?.TransmitClientEvent(
                        0,
                        (MOBIFLIGHT_EVENTS)eventItem.Item2,
                        value,
                        SIMCONNECT_NOTIFICATION_GROUP_ID.SIMCONNECT_GROUP_PRIORITY_DEFAULT,
                        SIMCONNECT_EVENT_FLAG.GROUPID_IS_PRIORITY
                    );

                    System.Threading.Thread.Sleep(MSFS_TRANSMIT_LOCK_TIMEOUT);

                    System.Threading.Monitor.Exit(_msfs_transmit_lock);
                }
            }
            catch (Exception exception)
            {
                Logger.ServerLog(exception.Message, LogLevel.ERROR);
            }
        }

        public float GetSimVar(String SimVarName)
        {
            float result = 0;
            if (!SimVars.Exists(lvar => lvar.Name == SimVarName))
            {
                RegisterSimVar(SimVarName);
                MobiFlightWasmClient.SendWasmCmd(_simConnect, "MF.SimVars.Add." + SimVarName);
            }

            result = SimVars.Find(lvar => lvar.Name == SimVarName).Data;

            return result;
        }

        public void SetSimVar(String SimVarCode)
        {
            MobiFlightWasmClient.SendWasmCmd(_simConnect, "MF.SimVars.Set." + SimVarCode);
            MobiFlightWasmClient.DummyCommand(_simConnect);
        }

        private void LoadEventPresets()
        {

            if (_simConnectEvents == null) _simConnectEvents = new Dictionary<string, List<Tuple<String, uint>>>();
            _simConnectEvents.Clear();

            var GroupKey = "Dummy";
            uint EventIdx = 0;
            string[] lines;

            var file = $@"{AppDomain.CurrentDomain.BaseDirectory}Data\MobiFlightPresets\msfs2020_eventids.cip";
            if (File.Exists(file))
            {
                lines = File.ReadAllLines(file);

                _simConnectEvents[GroupKey] = new List<Tuple<String, uint>>();
                foreach (string line in lines)
                {
                    if (line.StartsWith("//")) continue;

                    var cols = line.Split(':');
                    if (cols.Length > 1)
                    {
                        GroupKey = cols[0];
                        if (_simConnectEvents.ContainsKey(GroupKey)) continue;

                        _simConnectEvents[GroupKey] = new List<Tuple<String, uint>>();
                        continue; // we found a group
                    }

                    _simConnectEvents[GroupKey].Add(new Tuple<string, uint>(cols[0], EventIdx++));
                }
            }

            file = $@"{AppDomain.CurrentDomain.BaseDirectory}Data\MobiFlightPresets\msfs2020_eventids_user.cip";
            if (File.Exists(file))
            {
                lines = File.ReadAllLines(file);
                GroupKey = "User";
                _simConnectEvents[GroupKey] = new List<Tuple<String, uint>>();
                foreach (string line in lines)
                {
                    if (line.StartsWith("//")) continue;
                    var cols = line.Split(':');
                    if (cols.Length > 1)
                    {
                        GroupKey = cols[0];
                        if (_simConnectEvents.ContainsKey(GroupKey)) continue;

                        _simConnectEvents[GroupKey] = new List<Tuple<String, uint>>();
                        continue; // we found a group
                    }

                    _simConnectEvents[GroupKey].Add(new Tuple<string, uint>(cols[0], EventIdx++));
                }
            }
        }

        private void InitializeSimConnect()
        {
            // The constructor is similar to SimConnect_Open in the native API
            _simConnect = new SimConnect("Simconnect - Simvar test", Process.GetCurrentProcess().MainWindowHandle, WM_USER_SIMCONNECT, null, 0);

            // Listen to connect and quit msgs
            _simConnect.OnRecvOpen += HandleOnRecvOpen;
            _simConnect.OnRecvQuit += HandleOnRecvQuit;
            _simConnect.OnRecvException += HandleOnRecvException;
            _simConnect.OnRecvEvent += HandleOnReceiveEvent;

            _simConnect.UnsubscribeFromSystemEvent(SystemEvent.SIMSTART);
            _simConnect.SubscribeToSystemEvent(SystemEvent.SIMSTART, "SimStart");
            _simConnect.UnsubscribeFromSystemEvent(SystemEvent.SIMSTOP);
            _simConnect.SubscribeToSystemEvent(SystemEvent.SIMSTOP, "SimStop");

            _simConnect.OnRecvSimobjectDataBytype += HandleOnRecvSimobjectDataBytype;
            var definitions = DataDefinition.GetDefinition();
            foreach (var (PropName, SimConnectName, SimConnectUnit, SimConnectDataType) in definitions)
                _simConnect.AddToDataDefinition(SIMCONNECT_DATA_DEFINITION.SIMCONNECT_DATA_STRUCT, SimConnectName, SimConnectUnit, SimConnectDataType, 0.0f, SimConnect.SIMCONNECT_UNUSED);
            _simConnect.RegisterDataDefineStruct<SimConnectStruct>(SIMCONNECT_DATA_DEFINITION.SIMCONNECT_DATA_STRUCT);

            _connectionTimer.Enabled = false;

            System.Threading.Thread.Sleep(2000);
            ReceiveMessage();

            OnConnected?.Invoke(this, null);
        }

        private void HandleOnRecvSimobjectDataBytype(SimConnect sender, SIMCONNECT_RECV_SIMOBJECT_DATA_BYTYPE data)
        {
            if (data.dwRequestID == 0)
            {
                try
                {
                    var simConnectStruct = (SimConnectStruct)data.dwData[0];
                    var simConnectStructFields = typeof(SimConnectStruct).GetFields();
                    var simData = new ExpandoObject();

                    var definition = DataDefinition.GetDefinition();
                    int i = 0;
                    foreach (var item in definition)
                        simData.TryAdd(item.PropName, simConnectStructFields[i++].GetValue(simConnectStruct));

                    SimData = simData;

                    OnReceivedData?.Invoke(this, new EventArgs<dynamic>(simData));
                }
                catch (Exception ex)
                {
                    Logger.ServerLog($"SimConnect receive data exception: {ex.Message}", LogLevel.ERROR);
                }
            }
            else
            {
                Logger.ServerLog($"SimConnect unknown request ID: {data.dwRequestID}", LogLevel.ERROR);
            }
        }

        private void HandleOnRecvOpen(SimConnect sender, SIMCONNECT_RECV_OPEN data)
        {
            _connected = true;

            foreach (string GroupKey in _simConnectEvents.Keys)
            {
                foreach (Tuple<string, uint> eventItem in _simConnectEvents[GroupKey])
                {
                    var prefix = "";
                    switch (GroupKey)
                    {
                        case STANDARD_EVENT_GROUP:
                            break;
                        case SIMCONNECT_EVENT_GROUP:
                            break;
                        default:
                            prefix = "MobiFlight.";
                            break;
                    }

                    (sender).MapClientEventToSimEvent((MOBIFLIGHT_EVENTS)eventItem.Item2, prefix + eventItem.Item1);
                }
            }

            InitializeClientDataAreas(sender);
            (sender).OnRecvClientData += HandleOnRecvClientData;
        }

        private void InitializeClientDataAreas(SimConnect sender)
        {
            // register Client Data (for SimVars)
            (sender).MapClientDataNameToID(MOBIFLIGHT_CLIENT_DATA_NAME_SIMVAR, SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_LVARS);
            (sender).CreateClientData(SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_LVARS, 4096, SIMCONNECT_CREATE_CLIENT_DATA_FLAG.DEFAULT);

            // register Client Data (for WASM Module Commands)
            var ClientDataStringSize = (uint)Marshal.SizeOf(typeof(ClientDataString));
            (sender).MapClientDataNameToID(MOBIFLIGHT_CLIENT_DATA_NAME_COMMAND, SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_CMD);
            (sender).CreateClientData(SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_CMD, MOBIFLIGHT_MESSAGE_SIZE, SIMCONNECT_CREATE_CLIENT_DATA_FLAG.DEFAULT);

            // register Client Data (for WASM Module Responses)
            (sender).MapClientDataNameToID(MOBIFLIGHT_CLIENT_DATA_NAME_RESPONSE, SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_RESPONSE);
            (sender).CreateClientData(SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_RESPONSE, MOBIFLIGHT_MESSAGE_SIZE, SIMCONNECT_CREATE_CLIENT_DATA_FLAG.DEFAULT);

            (sender).AddToClientDataDefinition((SIMCONNECT_DEFINE_ID)0, 0, MOBIFLIGHT_MESSAGE_SIZE, 0, 0);
            (sender).RegisterStruct<SIMCONNECT_RECV_CLIENT_DATA, ResponseString>((SIMCONNECT_DEFINE_ID)0);
            (sender).RequestClientData(
                SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_RESPONSE,
                (SIMCONNECT_REQUEST_ID)0,
                (SIMCONNECT_DEFINE_ID)0,
                SIMCONNECT_CLIENT_DATA_PERIOD.ON_SET,
                SIMCONNECT_CLIENT_DATA_REQUEST_FLAG.CHANGED,
                0,
                0,
                0
            );
        }

        private void HandleOnRecvClientData(SimConnect sender, SIMCONNECT_RECV_CLIENT_DATA data)
        {
            if (data.dwRequestID != 0)
            {
                var simData = (ClientDataValue)(data.dwData[0]);
                if (SimVars.Count < (int)(data.dwRequestID)) return;
                SimVars[(int)(data.dwRequestID - 1)].Data = simData.data;
            }
            else
            {
                var simData = (ResponseString)(data.dwData[0]);
                if (simData.Data == "MF.LVars.List.Start")
                {
                    ResponseStatus = "LVars.List.Receiving";
                    LVars.Clear();
                }
                else if (simData.Data == "MF.LVars.List.End")
                {
                    ResponseStatus = "LVars.List.Completed";
                    LVarListUpdated?.Invoke(LVars, new EventArgs());
                }
                else if (ResponseStatus == "LVars.List.Receiving")
                {
                    LVars.Add(simData.Data);
                }
            }
        }

        private void HandleOnReceiveEvent(SimConnect sender, SIMCONNECT_RECV_EVENT data)
        {
            var eventId = ((SystemEvent)data.uEventID).ToString();
            OnReceiveSystemEvent?.Invoke(this, new EventArgs<string>(eventId));
        }

        private void HandleOnRecvQuit(SimConnect sender, SIMCONNECT_RECV data)
        {
            Stop();
            OnDisconnected?.Invoke(this, null);
        }

        private void HandleOnRecvException(SimConnect sender, SIMCONNECT_RECV_EXCEPTION data)
        {
            SIMCONNECT_EXCEPTION e = (SIMCONNECT_EXCEPTION)data.dwException;

            if(e != SIMCONNECT_EXCEPTION.ALREADY_CREATED)
                Logger.ServerLog("SimConnectCache::Exception " + e.ToString(), LogLevel.ERROR);
        }

        private void RegisterSimVar(string SimVarName)
        {
            SimVar NewSimVar = new SimVar() { Name = SimVarName, Id = (uint)SimVars.Count + 1 };
            SimVars.Add(NewSimVar);

            if (MaxClientDataDefinition >= NewSimVar.Id)
            {
                return;
            }

            MaxClientDataDefinition = NewSimVar.Id;

            _simConnect?.AddToClientDataDefinition(
                (SIMCONNECT_DEFINE_ID)NewSimVar.Id,
                (uint)((SimVars.Count - 1) * sizeof(float)),
                sizeof(float),
                0,
                0);

            _simConnect?.RegisterStruct<SIMCONNECT_RECV_CLIENT_DATA, ClientDataValue>((SIMCONNECT_DEFINE_ID)NewSimVar.Id);

            _simConnect?.RequestClientData(
                SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_LVARS,
                (SIMCONNECT_REQUEST_ID)NewSimVar.Id,
                (SIMCONNECT_DEFINE_ID)NewSimVar.Id,
                SIMCONNECT_CLIENT_DATA_PERIOD.ON_SET,
                SIMCONNECT_CLIENT_DATA_REQUEST_FLAG.CHANGED,
                0,
                0,
                0
            );
        }

        private void ClearSimVars()
        {
            SimVars.Clear();
            Logger.ServerLog("SimConnectCache::ClearSimVars. SimVars Cleared", LogLevel.INFO);
        }
    }
}
