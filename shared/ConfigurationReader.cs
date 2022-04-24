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
    }
}
