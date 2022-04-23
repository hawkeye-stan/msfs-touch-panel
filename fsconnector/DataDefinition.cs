using Microsoft.FlightSimulator.SimConnect;
using System.Collections.Generic;

namespace MSFSTouchPanel.FSConnector
{
    public class DataDefinition
    {
        public static List<(string propName, string variableName, string simConnectUnit, DataType simConnectDataType, DataDefinitionType dataDefinitionType)> GetDefinition()
        {
            var def = new List<(string, string, string, DataType, DataDefinitionType)>
            {
                ("TITLE", "TITLE", null, DataType.String, DataDefinitionType.SimConnect),

                ("PLANE_LATITUDE", "PLANE LATITUDE", "degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("PLANE_LONGITUDE", "PLANE LONGITUDE", "degrees", DataType.Float64, DataDefinitionType.SimConnect),

                ("PLANE_HEADING_DEGREES_MAGNETIC", "PLANE HEADING DEGREES MAGNETIC", "degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("PLANE_HEADING_DEGREES_TRUE", "PLANE HEADING DEGREES TRUE", "degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("PLANE_ALTITUDE", "PLANE ALTITUDE", "feet", DataType.Float64, DataDefinitionType.SimConnect),
                ("PLANE_ALT_ABOVE_GROUND", "PLANE ALT ABOVE GROUND", "feet", DataType.Float64, DataDefinitionType.SimConnect),
                ("AIRSPEED_INDICATED", "AIRSPEED INDICATED", "knots", DataType.Float64, DataDefinitionType.SimConnect),
                ("VERTICAL_SPEED", "VERTICAL SPEED", "feet/minute", DataType.Float64, DataDefinitionType.SimConnect),
                ("PLANE_PITCH_DEGREES", "PLANE PITCH DEGREES", "degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("PLANE_BANK_DEGREES", "PLANE BANK DEGREES", "degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("KOHLSMAN_SETTING_HG", "KOHLSMAN SETTING HG", "inHg", DataType.Float64, DataDefinitionType.SimConnect),

                ("FLAPS_HANDLE_INDEX", "FLAPS HANDLE INDEX", "number", DataType.Float64, DataDefinitionType.SimConnect),
                ("FLAPS_HANDLE_PERCENT", "FLAPS HANDLE PERCENT", "percent", DataType.Float64, DataDefinitionType.SimConnect),
                ("TRAILING_EDGE_FLAPS_LEFT_ANGLE", "TRAILING EDGE FLAPS LEFT ANGLE", "degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("ELEVATOR_TRIM_PCT", "ELEVATOR TRIM PCT", "percent", DataType.Float64, DataDefinitionType.SimConnect),
                ("AILERON_RIGHT_DEFLECTION", "AILERON RIGHT DEFLECTION", "radians", DataType.Float64, DataDefinitionType.SimConnect),

                ("GEAR_POSITION", "GEAR POSITION", "enum", DataType.Float64, DataDefinitionType.SimConnect),
                ("GEAR_CENTER_POSITION", "GEAR CENTER POSITION", "percent", DataType.Float64, DataDefinitionType.SimConnect),
                ("GEAR_LEFT_POSITION", "GEAR LEFT POSITION", "percent", DataType.Float64, DataDefinitionType.SimConnect),
                ("GEAR_RIGHT_POSITION", "GEAR RIGHT POSITION", "percent", DataType.Float64, DataDefinitionType.SimConnect),

                ("TRANSPONDER_CODE", "TRANSPONDER CODE:1", "number", DataType.Float64, DataDefinitionType.SimConnect),

                ("AUTOPILOT_MASTER", "AUTOPILOT MASTER", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_FLIGHT_DIRECTOR_ACTIVE", "AUTOPILOT FLIGHT DIRECTOR ACTIVE", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("GPS_DRIVES_NAV1", "GPS DRIVES NAV1", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_APPROACH_HOLD", "AUTOPILOT APPROACH HOLD", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_NAV1_LOCK", "AUTOPILOT NAV1 LOCK", "bool", DataType.Float64, DataDefinitionType.SimConnect),

                ("AUTOPILOT_ALTITUDE_LOCK", "AUTOPILOT ALTITUDE LOCK", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_ALTITUDE_LOCK_VAR", "AUTOPILOT ALTITUDE LOCK VAR:1", "feet", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_HEADING_LOCK", "AUTOPILOT HEADING LOCK", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_HEADING_LOCK_DIR", "AUTOPILOT HEADING LOCK DIR:1", "degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_VERTICAL_HOLD", "AUTOPILOT VERTICAL HOLD", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_VERTICAL_HOLD_VAR", "AUTOPILOT VERTICAL HOLD VAR", "feet/minute", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_FLIGHT_LEVEL_CHANGE", "AUTOPILOT FLIGHT LEVEL CHANGE", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_AIRSPEED_HOLD_VAR", "AUTOPILOT AIRSPEED HOLD VAR", "knots", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_YAW_DAMPER", "AUTOPILOT YAW DAMPER", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_WING_LEVELER", "AUTOPILOT WING LEVELER", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_THROTTLE_ARM", "AUTOPILOT THROTTLE ARM", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AUTOPILOT_BACKCOURSE_HOLD", "AUTOPILOT BACKCOURSE HOLD", "bool", DataType.Float64, DataDefinitionType.SimConnect),

                ("ELECTRICAL_MASTER_BATTERY", "ELECTRICAL MASTER BATTERY", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("GENERAL_ENG_MASTER_ALTERNATOR_1", "GENERAL ENG MASTER ALTERNATOR:1", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("AVIONICS_MASTER_SWITCH", "AVIONICS MASTER SWITCH", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("GENERAL_ENG_FUEL_PUMP_SWITCH", "GENERAL ENG FUEL PUMP SWITCH:1", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("STRUCTURAL_DEICE_SWITCH", "STRUCTURAL DEICE SWITCH", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("PITOT_HEAT", "PITOT HEAT", "bool", DataType.Float64, DataDefinitionType.SimConnect),

                ("LIGHT_LANDING_ON", "LIGHT LANDING", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("LIGHT_TAXI_ON", "LIGHT TAXI", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("LIGHT_NAV_ON", "LIGHT NAV", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("LIGHT_BEACON_ON", "LIGHT BEACON", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("LIGHT_STROBE_ON", "LIGHT STROBE", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("LIGHT_PANEL_ON", "LIGHT PANEL", "bool", DataType.Float64, DataDefinitionType.SimConnect),

                ("PROP_RPM_1", "PROP RPM:1", "rpm", DataType.Float64, DataDefinitionType.SimConnect),
                ("TURB_ENG_CORRECTED_N1_1", "TURB ENG CORRECTED N1:1", "percent", DataType.Float64, DataDefinitionType.SimConnect),

                ("GENERAL_ENG_RPM_1", "GENERAL ENG RPM:1", "rpm", DataType.Float64, DataDefinitionType.SimConnect),
                ("GENERAL_ENG_THROTTLE_LEVER_POSITION_1", "GENERAL ENG THROTTLE LEVER POSITION:1", "percent", DataType.Float64, DataDefinitionType.SimConnect),
                ("GENERAL_ENG_MIXTURE_LEVER_POSITION_1", "GENERAL ENG MIXTURE LEVER POSITION:1", "percent", DataType.Float64, DataDefinitionType.SimConnect),

                ("NAV_ACTIVE_FREQUENCY_1", "NAV ACTIVE FREQUENCY:1", "mhz", DataType.Float64, DataDefinitionType.SimConnect),
                ("NAV_STANDBY_FREQUENCY_1", "NAV STANDBY FREQUENCY:1", "mhz", DataType.Float64, DataDefinitionType.SimConnect),
                ("NAV_ACTIVE_FREQUENCY_2", "NAV ACTIVE FREQUENCY:2", "mhz", DataType.Float64, DataDefinitionType.SimConnect),
                ("NAV_STANDBY_FREQUENCY_2", "NAV STANDBY FREQUENCY:2", "mhz", DataType.Float64, DataDefinitionType.SimConnect),

                ("ADF_ACTIVE_FREQUENCY_1", "ADF ACTIVE FREQUENCY:1", "Frequency ADF BCD32", DataType.Float64, DataDefinitionType.SimConnect),
                ("ADF_STANDBY_FREQUENCY_1", "ADF STANDBY FREQUENCY:1", "Frequency ADF BCD32", DataType.Float64, DataDefinitionType.SimConnect),
                ("ADF_CARD", "ADF CARD", "Degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("NAV_OBS_1", "NAV OBS:1", "Degrees", DataType.Float64, DataDefinitionType.SimConnect),
                ("NAV_OBS_2", "NAV OBS:2", "Degrees", DataType.Float64, DataDefinitionType.SimConnect),

                ("COM_ACTIVE_FREQUENCY_1", "COM ACTIVE FREQUENCY:1", "mhz", DataType.Float64, DataDefinitionType.SimConnect),
                ("COM_STANDBY_FREQUENCY_1", "COM STANDBY FREQUENCY:1", "mhz", DataType.Float64, DataDefinitionType.SimConnect),
                ("COM_ACTIVE_FREQUENCY_2", "COM ACTIVE FREQUENCY:2", "mhz", DataType.Float64, DataDefinitionType.SimConnect),
                ("COM_STANDBY_FREQUENCY_2", "COM STANDBY FREQUENCY:2", "mhz", DataType.Float64, DataDefinitionType.SimConnect),

                ("COM_TRANSMIT_1", "COM TRANSMIT:1", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("COM_TRANSMIT_2", "COM TRANSMIT:2", "bool", DataType.Float64, DataDefinitionType.SimConnect),

                ("SIMULATION_RATE", "SIMULATION RATE", "number", DataType.Float64, DataDefinitionType.SimConnect),

                ("GPS_WP_PREV_LAT", "GPS WP PREV LAT", "radians", DataType.Float64, DataDefinitionType.SimConnect),
                ("GPS_WP_PREV_LON", "GPS WP PREV LON", "radians", DataType.Float64, DataDefinitionType.SimConnect),
                ("GPS_WP_NEXT_LAT", "GPS WP NEXT LAT", "radians", DataType.Float64, DataDefinitionType.SimConnect),
                ("GPS_WP_NEXT_LON", "GPS WP NEXT LON", "radians", DataType.Float64, DataDefinitionType.SimConnect),
                ("GPS_POSITION_LAT", "GPS POSITION LAT", "radians", DataType.Float64, DataDefinitionType.SimConnect),
                ("GPS_POSITION_LON", "GPS POSITION LON", "radians", DataType.Float64, DataDefinitionType.SimConnect),
                ("GPS_GROUND_SPEED", "GPS GROUND SPEED", "meters per second", DataType.Float64, DataDefinitionType.SimConnect),

                // Kodiak
                ("KODIAK_LANDING_LIGHT", "SWS_LIGHTING_Switch_Light_Landing", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_CABIN_LIGHT", "SWS_LIGHTING_Switch_Light_CABIN_12", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_PITOT_HEAT_1", "DEICE_Pitot_1", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_PITOT_HEAT_2", "DEICE_Pitot_2", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_AUX_BUS", "XMLVAR_AUX_Bus_ON", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_FUEL_PUMP", "SWS_FUEL_Switch_Pump_1", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_IGNITION", "SWS_ENGINE_Switch_Ignition_1", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_STARTER", "SWS_ENGINE_Switch_Starter_ThreeState_1", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_FUEL_SHUTOFF_LEFT", "SWS_Kodiak_TankSelector_1", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_FUEL_SHUTOFF_RIGHT", "SWS_Kodiak_TankSelector_2", null, DataType.Default, DataDefinitionType.LVar),
                ("KODIAK_OXYGEN", "XMLVAR_Oxygen", null, DataType.Default, DataDefinitionType.LVar),

                ("ENG_ANTI_ICE_1", "ENG ANTI ICE:1", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("PROP_DEICE_SWITCH", "PROP DEICE SWITCH:1", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("WINDSHIELD_DEICE_SWITCH", "WINDSHIELD DEICE SWITCH", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("LIGHT_WING", "LIGHT WING", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("ALTERNATOR_1_ON", "GENERAL ENG MASTER ALTERNATOR:1", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("ALTERNATOR_2_ON", "GENERAL ENG MASTER ALTERNATOR:2", "bool", DataType.Float64, DataDefinitionType.SimConnect),
                ("KODIAK_GLARESHIELD_SETTING", "LIGHT POTENTIOMETER:3", "number", DataType.Float64, DataDefinitionType.SimConnect),
                ("KODIAK_INSTRUMENTATION_LIGHT_SETTING", "LIGHT POTENTIOMETER:2", "number", DataType.Float64, DataDefinitionType.SimConnect),
                ("KODIAK_PANEL_LIGHT_SETTING", "LIGHT POTENTIOMETER:21", "number", DataType.Float64, DataDefinitionType.SimConnect)
            };

            return def;
        }
    }
}
