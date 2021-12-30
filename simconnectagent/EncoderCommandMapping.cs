using System.Collections.Generic;

namespace MSFSTouchPanel.SimConnectAgent
{
    public class EncoderCommandMapping
    {
        public List<string> Command { get; set; }

        public string Encoder1CW { get; set; }

        public string Encoder1CCW { get; set; }

        public string Encoder2CW { get; set; }

        public string Encoder2CCW { get; set; }

        public string Encoder1Switch { get; set; }

        public string Encoder2Switch { get; set; }

        public string Joystick1Up { get; set; }

        public string Joystick1Down { get; set; }

        public string Joystick1Left { get; set; }

        public string Joystick1Right { get; set; }

        public string Joystick1Switch { get; set; }
    }
}
