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

                for (var i = 0; i < files.Length; i++)
                {
                    using (StreamReader reader = new StreamReader(files[i]))
                    {
                        definitions.AddRange(JsonConvert.DeserializeObject<List<SimConnectDataDefinition>>(reader.ReadToEnd()));
                        
                    }
                }

                return definitions;
            }
            catch
            {
                Logger.ServerLog("ERROR: SimConnectDataDefinition.json file is not found or is invalid.", LogLevel.ERROR);
                return new List<SimConnectDataDefinition>();
            }
        }
    }
}
