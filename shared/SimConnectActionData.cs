using Newtonsoft.Json.Converters;
using System.Text.Json.Serialization;

namespace MSFSTouchPanel.Shared
{
    public class SimConnectActionData
    {
        public string Action { get; set; }

        public SimConnectActionType ActionType { get; set; }

        public int ActionValue { get; set; }

        public SimConnectEncoderAction EncoderAction { get; set; }
    }

    public class SimConnectEncoderAction
    {
        public string Encoder1CW { get; set; }

        public string Encoder1CCW { get; set; }

        public string Encoder1Switch { get; set; }

        public string Encoder2CW { get; set; }

        public string Encoder2CCW { get; set; }

        public string Encoder2Switch { get; set; }

        public string Joystick1Up { get; set; }

        public string Joystick1Down { get; set; }

        public string Joystick1Left { get; set; }

        public string Joystick1Right { get; set; }

        public string Joystick1Switch { get; set; }

        public SimConnectActionType ActionType { get; set; }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum SimConnectActionType
    {
        SimEventId,
        SimVarCode,
        EncoderAction
    }

    public class CommandAction
    {
        public CommandAction()
        {
            ActionValue = 1;
            ActionType = SimConnectActionType.SimEventId;
        }

        public CommandAction(string action, SimConnectActionType actionType)
        {
            Action = action;
            ActionValue = 1;
            ActionType = actionType;
        }

        public CommandAction(string action, SimConnectActionType actionType, uint actionValue)
        {
            Action = action;
            ActionValue = actionValue;
            ActionType = actionType;
        }

        public string Action { get; set; }

        public SimConnectActionType ActionType { get; set; }

        public uint ActionValue { get; set; }
    }
}
