using Microsoft.FlightSimulator.SimConnect;
using System;
using System.Collections.Generic;

namespace MSFSTouchPanel.FSConnector
{
    public class MobiFlightWasmClient
    {
        //public static List<SimVar> SimVars = new List<SimVar>();
        //private static uint MaxClientDataDefinition = 0;
        
        //public static void Ping(SimConnect simConnect)
        //{
        //    if (simConnect == null) return;

        //    SendWasmCmd(simConnect, "MF.Ping");
        //    DummyCommand(simConnect);
        //}

        //public static void Stop(SimConnect simConnect)
        //{
        //    if (simConnect == null) return;
        //    SendWasmCmd(simConnect, "MF.SimVars.Clear");

        //    SimVars.Clear();
        //}

        //public static void DummyCommand(SimConnect simConnect)
        //{
        //    if (simConnect == null) return;

        //    SendWasmCmd(simConnect, "MF.DummyCmd");
        //}

        //public static void SendWasmCmd(SimConnect simConnect, String command)
        //{
        //    if (simConnect == null) return;

        //    simConnect.SetClientData(
        //        SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_CMD,
        //       (SIMCONNECT_CLIENT_DATA_ID)0,
        //       SIMCONNECT_CLIENT_DATA_SET_FLAG.DEFAULT, 0,
        //       new ClientDataString(command)
        //    );
        //}
        //public static void GetLVarList(SimConnect simConnect)
        //{
        //    if (simConnect == null) return;

        //    SendWasmCmd(simConnect, "MF.LVars.List");
        //    DummyCommand(simConnect);
        //}

        //public static float GetSimVar(SimConnect simConnect, String simVarName)
        //{
        //    float result = 0;
        //    if (!SimVars.Exists(lvar => lvar.Name == simVarName))
        //    {
        //        RegisterSimVar(simConnect, simVarName);
        //        SendWasmCmd(simConnect, "MF.SimVars.Add." + simVarName);
        //    }

        //    result = SimVars.Find(lvar => lvar.Name == simVarName).Data;

        //    return result;
        //}

        //public static void SetSimVar(SimConnect simConnect, String simVarCode)
        //{
        //    SendWasmCmd(simConnect, "MF.SimVars.Set." + simVarCode);
        //    DummyCommand(simConnect);
        //}

        //private static void RegisterSimVar(SimConnect simConnect, string simVarName)
        //{
        //    SimVar newSimVar = new SimVar() { Name = simVarName, Id = (uint)SimVars.Count + 1 };
        //    SimVars.Add(newSimVar);

        //    if (MaxClientDataDefinition >= newSimVar.Id)
        //    {
        //        return;
        //    }

        //    MaxClientDataDefinition = newSimVar.Id;

        //    simConnect?.AddToClientDataDefinition(
        //        (SIMCONNECT_DEFINE_ID)newSimVar.Id,
        //        (uint)((SimVars.Count - 1) * sizeof(float)),
        //        sizeof(float),
        //        0,
        //        0);

        //    simConnect?.RegisterStruct<SIMCONNECT_RECV_CLIENT_DATA, ClientDataValue>((SIMCONNECT_DEFINE_ID)newSimVar.Id);

        //    simConnect?.RequestClientData(
        //        SIMCONNECT_CLIENT_DATA_ID.MOBIFLIGHT_LVARS,
        //        (SIMCONNECT_REQUEST_ID)newSimVar.Id,
        //        (SIMCONNECT_DEFINE_ID)newSimVar.Id,
        //        SIMCONNECT_CLIENT_DATA_PERIOD.ON_SET,
        //        SIMCONNECT_CLIENT_DATA_REQUEST_FLAG.CHANGED,
        //        0,
        //        0,
        //        0
        //    );
        //}

        //internal void RefreshLVarsList(SimConnect simConnect)
        //{
        //    if (simConnect == null) return;
        //    GetLVarList(simConnect);
        //}

        //public static void ClearSimVars()
        //{
        //    SimVars.Clear();
        //}
    }
}
