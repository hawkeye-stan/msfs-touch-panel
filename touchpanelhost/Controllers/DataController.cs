using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using MSFSTouchPanel.FSConnector;
using MSFSTouchPanel.Shared;
using MSFSTouchPanel.SimConnectAgent;
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

        [HttpGet("/getdebuggerpagelist")]
        public string GetDebuggerPageList()
        {
            try
            {
                return GetCoherentDebuggerPageList().Result;
            }
            catch
            {
                return null;
            }
        }

        private async Task<string> GetCoherentDebuggerPageList()
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync("http://127.0.0.1:19999/pagelist.json");
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();

            return responseBody;
        }

        [HttpGet("/getdata")]
        public SimConnectData Get()
        {
            try
            {
                var data = _memoryCache.Get<string>("simdata");
                var lvar = _memoryCache.Get<string>("simdataLVar");
                var arudinoStatus = _memoryCache.Get<bool>("arduinoStatus");
                var msfsStatus = _memoryCache.Get<bool>("msfsStatus");
                var simSystemEvent = _memoryCache.Get<string>("simSystemEvent");
                var g1000nxiFlightPlan = _memoryCache.Get<string>("g1000nxiFlightPlan");

                return new SimConnectData { Data = data, LVar = lvar, MsfsStatus = Convert.ToBoolean(msfsStatus), ArduinoStatus = Convert.ToBoolean(arudinoStatus), SystemEvent = simSystemEvent, G1000NxiFlightPlan = g1000nxiFlightPlan };
            }
            catch
            {
                return new SimConnectData { Data = null, LVar = null, MsfsStatus = false, ArduinoStatus = false, SystemEvent = null, G1000NxiFlightPlan = null };
            }
        }

        [HttpPost("/postdata")]
        public IActionResult Post(SimConnectPostData data)
        {
            var value = Convert.ToString(data.Value);
            var planeProfile = (PlaneProfile)Enum.Parse(typeof(PlaneProfile), data.PlaneProfile);

            _simConnectService.ExecAction(data.Action, value, planeProfile);

            var clientIP = HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

            Logger.ClientLog($"ClientIP: {clientIP, -20} Action: {data.Action,-35} Value: {value, -7} Profile: {data.PlaneProfile}", LogLevel.INFO);

            return Ok();
        }

        [HttpGet("/getflightplan")]
        public string GetFlightPlan()
        {
            return _simConnectService.GetFlightPlan();
        }

        [HttpPost("/postflightplan")]
        public IActionResult PostFlightPlan(G1000NxiFlightPlanRawData data)
        {
            try
            {
                _simConnectService.ProcessG1000NxiFlightPlan(data);
            }
            catch(Exception ex) 
            {
                Logger.ServerLog(ex.Message, LogLevel.ERROR);
            }
            
            return Ok();
        }

        [HttpGet("/getplanepanelprofileinfo")]
        public string GetPlanePanelProfileInfo()
        {
            try
            {
                var filePath = Path.Combine(AppContext.BaseDirectory, @"Data\PlanePanelProfileInfo.json");
                return System.IO.File.ReadAllText(filePath);

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

        public string LVar { get; set; }

        public bool MsfsStatus { get; set; }

        public bool ArduinoStatus { get; set; }

        public string SystemEvent { get; set; }
        
        public string G1000NxiFlightPlan { get; set; }
    }

    public class SimConnectPostData
    {
        public string Action { get; set; }

        public string ActionType { get; set; }

        public object Value { get; set; }

        public int ExecutionCount { get; set; }

        public string PlaneProfile { get; set; }

    }
}
