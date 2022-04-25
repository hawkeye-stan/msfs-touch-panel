using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using MSFSTouchPanel.Shared;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace MSFSTouchPanel.TouchPanelHost.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DataController : BaseController
    {
        private ISimConnectService _simConnectService;
        private IMemoryCache _memoryCache;
        private IWebHostEnvironment _hostingEnvironment;

        public DataController(IConfiguration configuration, IMemoryCache memoryCache, ISimConnectService simConnectService, IWebHostEnvironment environment) : base(configuration, memoryCache, simConnectService)
        {
            _simConnectService = simConnectService;
            _memoryCache = memoryCache;
            _hostingEnvironment = environment;
        }

        [HttpGet("/getdata")]
        public SimConnectData GetData()
        {
            try
            {
                var data = _memoryCache.Get<string>("simdata");
                var arudinoStatus = _memoryCache.Get<bool>("arduinoStatus");
                var msfsStatus = _memoryCache.Get<bool>("msfsStatus");
                var simSystemEvent = _memoryCache.Get<string>("simSystemEvent");
                var g1000nxiFlightPlan = _memoryCache.Get<string>("g1000nxiFlightPlan");

                return new SimConnectData { Data = data, MsfsStatus = Convert.ToBoolean(msfsStatus), ArduinoStatus = Convert.ToBoolean(arudinoStatus), SystemEvent = simSystemEvent, G1000NxiFlightPlan = g1000nxiFlightPlan };
            }
            catch
            {
                return new SimConnectData { Data = null, MsfsStatus = false, ArduinoStatus = false, SystemEvent = null, G1000NxiFlightPlan = null };
            }
        }

        [HttpPost("/postdata")]
        public IActionResult PostData(SimConnectActionData actionData)
        {
            _simConnectService.ExecAction(actionData);

            var clientIP = HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

            Logger.ClientLog($"ClientIP: {clientIP, -20} Action: {actionData.Action,-35} Value: {actionData.ActionValue, -7}", LogLevel.INFO);

            return Ok();
        }

        [HttpGet("/getflightplan")]
        public string GetFlightPlan()
        {
            return _simConnectService.GetFlightPlan();
        }

        [HttpGet("/getplanepanelprofileinfo")]
        public string GetPlanePanelProfileInfo()
        {
            try
            {
                var planeProfileConfiguration = ConfigurationReader.GetPlaneProfilesConfiguration();

                return JsonConvert.SerializeObject(planeProfileConfiguration, Formatting.Indented, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });
            }
            catch (Exception ex)
            {
                Logger.ServerLog(ex.Message, LogLevel.ERROR);
            }

            return string.Empty;
        }
    }

    public class SimConnectData
    {
        public string Data { get; set; }

        public bool MsfsStatus { get; set; }

        public bool ArduinoStatus { get; set; }

        public string SystemEvent { get; set; }
        
        public string G1000NxiFlightPlan { get; set; }
    }
}
