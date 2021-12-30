using System;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace MSFSTouchPanel.SimConnectAgent
{
    public class G1000NxiFlightPlanProvider
    {
        public static string ProcessFlightPlan(G1000NxiFlightPlanRawData data)
        {
            var flightPlan = new FlightPlan();
            flightPlan.activeLegIndex = data.activeLateralLeg;
            flightPlan.dtk = data.dtk;

            var wayPoints = new List<ATCWaypoint>();

            int wayPointId = 1;
            foreach (PlanSegment planSegment in data.planSegments)
            {
                foreach (Leg leg in planSegment.legs)
                {
                    if (leg.name == "HOLD")
                        continue;

                    var wayPoint = new ATCWaypoint();

                    wayPoint.id = leg.name;
                    wayPoint.description = leg.name;
                    wayPoint.index = wayPointId;
                    wayPoint.type = leg.leg.type.ToString();

                    if (data.activeCalculatingLeg == wayPointId)
                        wayPoint.isActiveLeg = true;

                    if (leg.calculated != null)
                    {
                        wayPoint.altitude = Convert.ToInt32(Math.Round(leg.leg.altitude1 * 3.28084));
                        wayPoint.latLong = new double[] { leg.calculated.endLat, leg.calculated.endLon };
                        wayPoint.startLatLong = new double[] { leg.calculated.startLat, leg.calculated.startLon };
                        wayPoint.distance = leg.calculated.distance;
                        wayPoint.course = Convert.ToInt32(leg.calculated.initialDtk);
                    }
                    else
                    {
                        wayPoint.latLong = new double[] { leg.leg.lat, leg.leg.lon };
                    }

                    wayPointId++;

                    //if (wayPoint.latLong[0] == 0 && wayPoint.latLong[1] == 0) continue;

                    wayPoints.Add(wayPoint);
                }
            }

            flightPlan.waypoints = wayPoints;

            return JsonConvert.SerializeObject(flightPlan);
        }
    }


    public class G1000NxiFlightPlanRawData
    {
        public int activeCalculatingLeg { get; set; }

        public int activeLateralLeg { get; set; }

        public int planIndex { get; set; }

        public List<PlanSegment> planSegments { get; set; }

        public string originAirport { get; set; }

        public string destinationAirport { get; set; }

        public ProcedureDetail procedureDetails { get; set; }

        public int dtk { get; set; }
    }
    
    public class PlanSegment
    {
        public int segmentIndex { get; set; }

        public int offset { get; set; }

        public List<Leg> legs { get; set; }

        public string segmentType { get; set; }
    }

    public class Leg
    {
        public LegInfo leg { get; set; }

        public string name { get; set; }

        public Calculated calculated { get; set; }

    }

    public class LegInfo
    {
        [JsonProperty("type")]
        public int type { get; set; }

        public double altitude1 { get; set; }

        public double altitude2 { get; set; }

        public double course { get; set; }

        public double lat { get; set; }

        public double lon { get; set; }
    }

    public class Calculated
    {
        public double startLat { get; set; }

        public double startLon { get; set; }

        public double endLat { get; set; }

        public double endLon { get; set; }

        public double initialDtk { get; set; }

        public double distance { get; set; }

        public double cumulativeDistance { get; set; }
    }

    public class ProcedureDetail
    {
        public Runway originRunway { get; set; }

        public Runway destinationRunway { get; set; }
    }

    public class Runway
    {
        public string designation { get; set; }

        public int direction { get; set; }

        public double elevation { get; set; }

        public double latitude { get; set; }

        public double longitude { get; set; }

        public ILSFrequency ilsFrequency { get; set; }
    }

    public class ILSFrequency 
    {
        public string name { get; set; }

        public double freqMHZ { get; set; }
    }
}
