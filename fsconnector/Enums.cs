﻿using System;
using System.Runtime.InteropServices;
using System.Text;

namespace MSFSTouchPanel.FSConnector
{
    [StructLayout(LayoutKind.Sequential, Pack = 1)]
    public struct ClientDataValue
    {
        public float data;
    }

    [StructLayout(LayoutKind.Sequential, Pack = 1)]
    public struct ClientDataString
    {
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 1024)]
        public byte[] data;

        public ClientDataString(string strData)
        {
            byte[] txtBytes = Encoding.ASCII.GetBytes(strData);
            var ret = new byte[1024];
            Array.Copy(txtBytes, ret, txtBytes.Length);
            data = ret;
        }
    }

    public enum SIMCONNECT_DEFINE_ID
    {
        Dummy = 0
    }

    public enum SIMCONNECT_DATA_DEFINITION
    {
        SIMCONNECT_DATA_STRUCT
    }

    public enum DATA_REQUEST
    {
        REQUEST_1
    }

    public enum SimConnectSystemEvent
    {
        FOURSECS,
        SIMSTART,
        SIMSTOP,
        FLIGHTLOADED,
        PAUSED,
        VIEW,
        NONE
    };

    public enum DataDefinitionType
    {
        AVar,
        LVar,
        SimConnect
    }

    public enum DataType
    {
        String,
        Float64,
        Default
    }
}
