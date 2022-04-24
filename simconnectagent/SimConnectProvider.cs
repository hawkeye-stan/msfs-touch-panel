using MSFSTouchPanel.ArduinoAgent;
using MSFSTouchPanel.FSConnector;
using MSFSTouchPanel.Shared;
using System;

namespace MSFSTouchPanel.SimConnectAgent
{
    public class SimConnectProvider
    {
        private ArduinoProvider _arduinoProvider;
        private SimConnector _simConnector;

        private DataProvider _dataProvider;
        private ActionProvider _actionProvider;

        public event EventHandler OnMsfsConnected;
        public event EventHandler OnMsfsDisconnected;
        public event EventHandler OnMsfsException;
        public event EventHandler<EventArgs<string>> OnDataRefreshed;
        public event EventHandler<EventArgs<string>> OnLVarReceived;
        public event EventHandler<EventArgs<string>> OnReceiveSystemEvent;
        public event EventHandler<EventArgs<bool>> OnArduinoConnectionChanged;

        public SimConnectProvider(IntPtr windowHandle)
        {
            _simConnector = new SimConnector();
            _simConnector.OnConnected += HandleSimConnected;
            _simConnector.OnDisconnected += HandleSimDisonnected;
            _simConnector.OnException += HandleSimException;
            _simConnector.OnReceiveSystemEvent += (source, e) => OnReceiveSystemEvent?.Invoke(this, new EventArgs<string>(e.Value));

            _arduinoProvider = new ArduinoProvider();
            _arduinoProvider.OnConnectionChanged += (source, e) => OnArduinoConnectionChanged?.Invoke(this, new EventArgs<bool>(e.Value));

            _dataProvider = new DataProvider(_simConnector);
            _dataProvider.OnDataRefreshed += (source, e) => OnDataRefreshed?.Invoke(this, e);

            _actionProvider = new ActionProvider(_simConnector, _arduinoProvider);
            _arduinoProvider.OnDataReceived += _actionProvider.ArduinoInputHandler;
        }

        public void Start()
        {
            _simConnector.Start();
            _arduinoProvider.Start();
        }

        public void Stop()
        {
            _arduinoProvider.Stop();
            _dataProvider.Stop();
            _actionProvider.Stop();
            _simConnector.Stop();

            OnMsfsDisconnected?.Invoke(this, null);
        }

        public void ExecAction(string action, string actionType, string value)
        {
            _actionProvider.ExecAction(action, actionType, value);
        }

        public void SetLVar(string propName, string value)
        {
            _actionProvider.SetLVar(propName, value);
        }

        public string GetFlightPlan()
        {
            return _dataProvider.GetFlightPlan();
        }

        private void HandleSimConnected(object source, EventArgs e)
        {
            _arduinoProvider.Start();
            _dataProvider.Start();
            _actionProvider.Start();
            
            OnMsfsConnected?.Invoke(this, null);

            Logger.ServerLog("MSFS connected", LogLevel.INFO);
        }

        private void HandleSimDisonnected(object source, EventArgs e)
        {
            _arduinoProvider.Stop();
            _dataProvider.Stop();
            _actionProvider.Stop();
            _simConnector.StopAndReconnect();

            OnMsfsDisconnected?.Invoke(this, null);

            Logger.ServerLog("MSFS disconnected", LogLevel.INFO);
        }

        private void HandleSimException(object source, EventArgs<string> e)
        {
            _arduinoProvider.Stop();
            _dataProvider.Stop();
            _actionProvider.Stop();
            _simConnector.StopAndReconnect();
            OnMsfsException?.Invoke(this, null);

            Logger.ServerLog(e.Value, LogLevel.ERROR);
        }
    }
}
