using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace MSFSTouchPanel.Shared
{
    public class ConfigurationReader
    {
        public static List<PlaneProfileInfo> GetPlaneProfilesConfiguration()
        {
            try
            {
                using (StreamReader reader = new StreamReader(Path.Combine(AppContext.BaseDirectory, @"Data\PlanePanelProfileInfo.json")))
                {
                    return JsonConvert.DeserializeObject<List<PlaneProfileInfo>>(reader.ReadToEnd());
                }
            }
            catch
            {
                Logger.ServerLog("ERROR: PlanePanelProfileInfo.json file is not found or is invalid.", LogLevel.ERROR);
                return new List<PlaneProfileInfo>();
            }
        }

        public static List<SimConnectDataDefinition> GetSimConnectDataDefinitions() 
        {
            try
            {
                var definitions = new List<SimConnectDataDefinition>();

                var folderPath = Path.Combine(AppContext.BaseDirectory, "Data");
                string[] files = Directory.GetFiles(folderPath, "SimConnectDataDefinition*.json");      // get json files starting with prefix 'SimConnectDataDefinition'

                // Add the special TITLE string variable first. It has to be to first property in SimConnectStruct
                definitions.Add(new SimConnectDataDefinition() { PropName = "TITLE", VariableName = "TITLE", DataType = DataType.String, DataDefinitionType = DataDefinitionType.SimConnect, DefaultValue = "" });

                for (var i = 0; i < files.Length; i++)
                {
                    using (StreamReader reader = new StreamReader(files[i]))
                    {
                        var definitionGroup = JsonConvert.DeserializeObject<List<SimConnectDataDefinition>>(reader.ReadToEnd());

                        foreach(var def in definitionGroup)
                        {
                            if (!definitions.Exists(d => d.PropName == def.PropName))
                                definitions.Add(def);
                            else
                                Logger.ServerLog($"{Path.GetFileName(files[i])} has duplicate entry with PropName: {def.PropName}", LogLevel.ERROR);
                        }
                    }
                }

                return definitions;
            }
            catch
            {
                Logger.ServerLog("SimConnectDataDefinition.json file is not found or is invalid.", LogLevel.ERROR);
                return new List<SimConnectDataDefinition>();
            }
        }
    }
}
