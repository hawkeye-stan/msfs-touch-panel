using System;
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

    public struct ResponseString
    {
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 1024)]
        public String Data;
    }

    public class SimVar
    {
        public UInt32 Id { get; set; }
        public String Name { get; set; }
        public float Data { get; set; }
    }

    public enum SIMCONNECT_CLIENT_DATA_ID
    {
        MOBIFLIGHT_LVARS,
        MOBIFLIGHT_CMD,
        MOBIFLIGHT_RESPONSE
    }

    public enum SIMCONNECT_REQUEST_ID
    {
        Dummy = 0
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

    public enum SIMCONNECT_NOTIFICATION_GROUP_ID
    {
        SIMCONNECT_GROUP_PRIORITY_DEFAULT,
        SIMCONNECT_GROUP_PRIORITY_HIGHEST
    }

    public enum SystemEvent
    {
        FOURSECS,
        SIMSTART,
        SIMSTOP,
        FLIGHTLOADED
    };

    public enum SimActionType
    {
        None,
        Shared,
        Custom,
        HVar
    }

    public enum MOBIFLIGHT_EVENTS
    {
        DUMMY
    };
}
