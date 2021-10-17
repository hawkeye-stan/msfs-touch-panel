﻿using MSFSTouchPanel.FSConnector;
using MSFSTouchPanel.Shared;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Timers;

namespace MSFSTouchPanel.SimConnectAgent
{
    public class DataProvider
    {
        private const int MSFS_DATA_REFRESH_TIMEOUT = 50;

        private SimConnector _simConnector;
        private Timer _requestDataTimer;

        public event EventHandler<EventArgs<string>> OnDataRefreshed;

        public DataProvider(SimConnector simConnector)
        {
            _simConnector = simConnector;
        }

        public void Start()
        {
            _requestDataTimer = new Timer();
            _requestDataTimer.Interval = MSFS_DATA_REFRESH_TIMEOUT;
            _requestDataTimer.Enabled = true;
            _requestDataTimer.Elapsed += HandleDataRequested;
            _requestDataTimer.Elapsed += HandleMessageReceived;

            _simConnector.OnReceivedData += HandleDataReceived;
        }

        public void Stop()
        {
            if(_requestDataTimer != null)
            {
                _requestDataTimer.Enabled = false;
                _simConnector.OnReceivedData -= HandleDataReceived;
                OnDataRefreshed?.Invoke(this, new EventArgs<string>(null));
            }
        }

        public string GetFlightPlan()
        {
            // MSFS 2020 Windows Store version: C:\Users\{username}\AppData\Local\Packages\Microsoft.FlightSimulator_8wekyb3d8bbwe\LocalState\MISSIONS\Custom\CustomFlight\CustomFlight.FLT
            // MSFS 2020 Steam version: C:\Users\{username}\AppData\Roaming\Microsoft Flight Simulator\MISSIONS\Custom\CustomFlight\CustomFlight.FLT
            var filePathMSStore = Environment.ExpandEnvironmentVariables("%LocalAppData%") + @"\Packages\Microsoft.FlightSimulator_8wekyb3d8bbwe\LocalState\MISSIONS\Custom\CustomFlight\CustomFlight.FLT";
            var filePathSteam = Environment.ExpandEnvironmentVariables("%AppData%") + @"\Microsoft Flight Simulator\MISSIONS\Custom\CustomFlight\CustomFlight.FLT";

            string filePath;

            if (File.Exists(filePathMSStore))
                filePath = filePathMSStore;
            else if (File.Exists(filePathSteam))
                filePath = filePathSteam;
            else
                filePath = null;

            // cannot find CustomFlight.PLN, return empty set of waypoints
            if(filePath == null)
                return JsonConvert.SerializeObject(new List<ExpandoObject>());

            return FlightPlan.ParseCustomFLT(filePath);
        }

        private void HandleDataRequested(object sender, ElapsedEventArgs e)
        {
            try
            {
                _simConnector.RequestData();
            }
            catch(Exception ex)
            {
                Logger.ServerLog(ex.Message, LogLevel.ERROR);
            }
        }

        private void HandleMessageReceived(object sender, ElapsedEventArgs e)
        {
            try
            {
                _simConnector.ReceiveMessage();
            }
            catch (Exception ex)
            {
                Logger.ServerLog(ex.Message, LogLevel.ERROR);
            }
        }

        public void HandleDataReceived(object sender, EventArgs<dynamic> e)
        {
            //var simData = _simConnector.LatestSimData;
            var simData = JsonConvert.DeserializeObject<dynamic>(JsonConvert.SerializeObject(e.Value));

            // Add simrate is valid calculation result
            // AddSimRateValidData(simData);

            var jsonData = JsonConvert.SerializeObject(simData);

            // Invoke on data refresh event by listener
            OnDataRefreshed?.Invoke(this, new EventArgs<string>(jsonData));
        }

        private void AddSimRateValidData(ref dynamic simData)
        {
            SimRateVar simRateVar = new SimRateVar()
            {
                APApproachHold = Convert.ToBoolean(simData.AUTOPILOT_APPROACH_HOLD),
                AltitudeAboveGround = simData.PLANE_ALT_ABOVE_GROUND,
                GroundSpeed = simData.GPS_GROUND_SPEED,
                VerticalSpeed = simData.VERTICAL_SPEED,
                PitchDegree = simData.PLANE_PITCH_DEGREES,
                BankDegree = simData.PLANE_BANK_DEGREES,
                WayPointNextLat = simData.GPS_WP_NEXT_LAT,
                WayPointNextLon = simData.GPS_WP_NEXT_LON,
                WayPointPreviousLat = simData.GPS_WP_PREV_LAT,
                WayPointPreviousLon = simData.GPS_WP_PREV_LON,
                PositionLat = simData.GPS_POSITION_LAT,
                PositionLon = simData.GPS_POSITION_LON
            };

            var simRateCalcResult = SimConnectCalcEngine.SimRateValid(simRateVar);
            simData.SIMULATION_RATE_VALID = simRateCalcResult.IsValid;
            simData.SIMULATION_RATE_INVALID_REASON = simRateCalcResult.InvalidReason;
        }
    }
}


