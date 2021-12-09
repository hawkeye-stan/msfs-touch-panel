import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSimConnectData } from '../../../Services/DataProviders/SimConnectDataProvider';
import { simConnectGetFlightPlan } from '../../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../../Services/LocalStorageProvider';
import { useInterval } from '../../Util/hooks';
import { useMap, LayersControl, LayerGroup, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet.marker.slideto';
import 'leaflet-marker-rotation';
import 'leaflet-easybutton';
import '@elfalem/leaflet-curve';
import { getDistance } from 'geolib';

const mapProvider = {
    openTopo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    openStreet: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    googleStreet: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
    googleTerrain: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
    googleSatellite: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
    googleHybrid: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
    aviation: 'http://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.png',
}

// This is to create two control points XXXX meters away any give waypoint to give flight path
// a smooth quadratic bezier curve transition. You can adjust the bezier curve radius with the constant below
const bezierCurveRadius = 100;

const getControlPoints = (waypoints) => {
    let controlPoints = [];
        for (var i = 0; i < waypoints.length; i++) {
            let prevWp = i === 0 ? null : waypoints[i - 1].latLong;
            let curWp = waypoints[i].latLong;
            let nextWp = i === waypoints.length - 1 ? null : waypoints[i + 1].latLong;

            var distance1 = prevWp === null ? null : getDistance({ latitude: prevWp[0], longitude: prevWp[1] }, { latitude: curWp[0], longitude: curWp[1] });
            var distance2 = nextWp === null ? null : getDistance({ latitude: curWp[0], longitude: curWp[1] }, { latitude: nextWp[0], longitude: nextWp[1] });

            let ratio1 = (distance1 / bezierCurveRadius) > 2 ? (distance1 / bezierCurveRadius) : 2;
            let ratio2 = (distance2 / bezierCurveRadius) > 2 ? (distance2 / bezierCurveRadius) : 2;

            var p1 = prevWp === null ? null : [(prevWp[0] - curWp[0]) / ratio1 + curWp[0], (prevWp[1] - curWp[1]) / ratio1 + curWp[1]];
            var p2 = nextWp === null ? null : [(nextWp[0] - curWp[0]) / ratio2 + curWp[0], (nextWp[1] - curWp[1]) / ratio2 + curWp[1]];

            controlPoints.push({ p1: p1, p2: p2 });
        }

    return controlPoints;
}

const getWaypointTooltip = (waypoint) => {
    let tooltip = '<div style="display:flex;flex-direction:column;font-size:0.85em;opacity:1.0">';
    tooltip += '<span style="font-weight: bold">' + waypoint.id + '</span>';
    
    if (waypoint.altitude !== null && waypoint.altitude !== 0)
        tooltip += '<span>Alt: ' + waypoint.altitude + 'ft</span>';
    if (waypoint.distance !== null)
        tooltip += '<span>Dist: ' + (waypoint.distance * 0.000539957).toFixed(1) + 'nm</span>';  // convert meter to NM
    if (waypoint.course !== null)
        tooltip += '<span>Course: ' + waypoint.course + '&deg;</span>';
    
    tooltip += '</div>';
    return tooltip;
}

const drawFlightPath = (waypoints, activeLegIndex, layerGroup, showFlightPlanLabel) => {
    let path, line, marker, tooltip;
    let controlPoints = getControlPoints(waypoints);

    waypoints.forEach((waypoint, index) => {
        let controlPoint = controlPoints[index];
        let nextControlPoint = controlPoints[index + 1];

        let lineColor = Boolean(waypoint.isActiveLeg) ? 'magenta' : 'blue'

        // First waypoint
        if (controlPoint.p1 === null) {
            path = [waypoint.latLong, controlPoint.p2];
            line = new L.Polyline(path, {color: lineColor});
            layerGroup.addLayer(line);
        }
        // Last waypoint
        else if (controlPoint.p2 === null) {
            path = [controlPoint.p1, waypoint.latLong];
            line = new L.Polyline(path, {color: lineColor});
            layerGroup.addLayer(line);
        }
        // All other waypoints inbetween, draw bezier curve
        else {
            path = ['M', controlPoint.p1, 'Q', waypoint.latLong, controlPoint.p2];
            line = L.curve(path, {color: 'blue'});
            layerGroup.addLayer(line);
        }

        // Waypoint marker
        tooltip = getWaypointTooltip(waypoint);
        marker = L.circleMarker(waypoint.latLong, {radius: 6, color: 'purple'}).bindTooltip(tooltip, { permanent: showFlightPlanLabel });
        layerGroup.addLayer(marker);

        // Draw inbetween control points line
        if (index < waypoints.length - 1) {
            path = [controlPoint.p2, nextControlPoint.p1];
            line = new L.Polyline(path, {color: lineColor});
            layerGroup.addLayer(line);
        }
    })
}

const centerPlaneToMap = (map, mapPosition, planePosition) => {
    mapPosition.current = planePosition.current;
    if (mapPosition.current !== null)
        map.panTo(mapPosition.current);
}

const planeIconDark = L.icon({
    iconUrl: '/img/airplane-dark.png',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

const planeIconLight = L.icon({
    iconUrl: '/img/airplane-light.png',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

var centerPlaneIcon, flightFollowingIcon, showFlightPlanIcon, showFlightPlanLabelIcon;

const MapDisplay = () => {
    const { simConnectData, simConnectSystemEvent, g1000NxiFlightPlan } = useSimConnectData();
    const { PLANE_HEADING_TRUE, GPS_LAT, GPS_LON } = simConnectData;
    const { mapConfig, updateMapConfig, configurationData } = useLocalStorageData();
    const { mapRefreshInterval } = configurationData;
    const [ waypoints, setWaypoints] = useState([]);

    const [ flightFollowing, setFlightFollowing] = useState(mapConfig.flightFollowing);
    const [ showFlightPlan, setShowFlightPlan] = useState(mapConfig.showFlightPlan);
    const [ showFlightPlanLabel, setShowFlightPlanLabel] = useState(mapConfig.showFlightPlanLabel);

    const planePosition = useRef([GPS_LAT * 180 / Math.PI, GPS_LON * 180 / Math.PI]);
    const mapPosition = useRef([GPS_LAT * 180 / Math.PI, GPS_LON * 180 / Math.PI]);
    
    const map = useMap();
    const layerGroupFlightPlan = useRef();
    const planeMarker = useRef();

    const selectedLayer = useRef('Google Terrain');

    const handleUpdateMapConfig = (key, value) => {
        let config = { ...mapConfig };
        config[key] = value;
        updateMapConfig(config);
    }


    useEffect(() => {
        layerGroupFlightPlan.current = L.layerGroup();
        map.addLayer(layerGroupFlightPlan.current);

        planeMarker.current = L.rotatedMarker([0, 0], { icon: planeIconDark, rotationAngle: 0, rotationOrigin: 'center' });
        map.addLayer(planeMarker.current);

        map.on("baselayerchange", e => {
            let config = { ...mapConfig };
            config.currentLayer = e.name;
            updateMapConfig(config);

            switch (e.name) {
                case 'Dark':
                case 'Google Satellite':
                case 'Google Hybrid':
                    planeMarker.current.setIcon(planeIconLight);
                    break;
                default:
                    planeMarker.current.setIcon(planeIconDark);
                    break;
            }

            selectedLayer.current = mapConfig.currentLayer;
        });

        centerPlaneToMap(map, mapPosition, planePosition);
    }, [map])

    useEffect(() => {
        if(centerPlaneIcon !== undefined) map.removeControl(centerPlaneIcon);
        if(flightFollowingIcon !== undefined) map.removeControl(flightFollowingIcon);
        if(showFlightPlanIcon !== undefined) map.removeControl(showFlightPlanIcon);
        if(showFlightPlanLabelIcon !== undefined) map.removeControl(showFlightPlanLabelIcon);

        centerPlaneIcon = L.easyButton('<span class="material-icons leaflet-icon">center_focus_weak</span>', () => {
            centerPlaneToMap(map, mapPosition, planePosition);
        }).addTo(map);

        flightFollowingIcon = L.easyButton(`<span class="material-icons leaflet-icon">${flightFollowing ? 'airplanemode_active' : 'airplanemode_inactive'}</span>`, () => {
            setFlightFollowing(!flightFollowing);
            handleUpdateMapConfig('flightFollowing', !flightFollowing);
        }).addTo(map);

        showFlightPlanIcon = L.easyButton(`<span class="material-icons leaflet-icon">${showFlightPlan ? 'content_paste' : 'content_paste_off'}</span>`, () => {
            setShowFlightPlan(!showFlightPlan);
            handleUpdateMapConfig('showFlightPlan', !showFlightPlan);
        }).addTo(map);

        showFlightPlanLabelIcon = L.easyButton(`<span class="material-icons leaflet-icon">${showFlightPlanLabel ? 'label' : 'label_off'}</span>`, () => {
            setShowFlightPlanLabel(!showFlightPlanLabel);
            handleUpdateMapConfig('showFlightPlanLabel', !showFlightPlanLabel);
        }).addTo(map);
    }, [map, flightFollowing, showFlightPlan, showFlightPlanLabel])

    useEffect(() => {
        if (planePosition.current !== null) {
            planeMarker.current.setLatLng(planePosition.current);
            planeMarker.current.setRotationAngle(PLANE_HEADING_TRUE);
        }
    }, []);

    useInterval(() => {
        planePosition.current = [GPS_LAT * 180 / Math.PI, GPS_LON * 180 / Math.PI];
    }, mapRefreshInterval);

    useEffect(() => {
        if ((simConnectSystemEvent !== null && simConnectSystemEvent === 'SIMSTART')) {

            simConnectGetFlightPlan().then(data => {
                if (data !== undefined && data !== null) {
                    setWaypoints(data.waypoints);
                }

                // override with G1000Nxi waypoint data
                if(g1000NxiFlightPlan != null && g1000NxiFlightPlan.waypoints !== null && g1000NxiFlightPlan.waypoints.length > 0)
                {
                    var flightPlan = JSON.stringify(g1000NxiFlightPlan.waypoints);
                    var wps = JSON.stringify(waypoints);
                    if(flightPlan !== wps)
                        setWaypoints(g1000NxiFlightPlan.waypoints);
                }
            });
        }
    }, [simConnectSystemEvent])

    useEffect(() => {
        if(g1000NxiFlightPlan != null && g1000NxiFlightPlan.waypoints !== null && g1000NxiFlightPlan.waypoints.length > 0)
        {
            var flightPlan = JSON.stringify(g1000NxiFlightPlan.waypoints);
            var wps = JSON.stringify(waypoints);
            if(flightPlan !== wps)
            {
                setWaypoints(g1000NxiFlightPlan.waypoints);
            }
        }
    }, [g1000NxiFlightPlan])

    useEffect(() => {
        layerGroupFlightPlan.current.clearLayers();
        if (waypoints !== undefined && waypoints.length > 1)
            drawFlightPath(waypoints, g1000NxiFlightPlan !== null ? g1000NxiFlightPlan.activeLegIndex : 0, layerGroupFlightPlan.current, showFlightPlanLabel);
            
    }, [waypoints, showFlightPlanLabel]);

    useEffect(() => {
        if (flightFollowing)
            map.panTo(planePosition.current);

        if (planePosition.current !== null) {
            planeMarker.current.slideTo(planePosition.current, { duration: mapRefreshInterval });
            planeMarker.current.setRotationAngle(PLANE_HEADING_TRUE);
        }
    }, [flightFollowing, map, mapRefreshInterval, planePosition.current])

    useMapEvents({
        dragstart: (e) => {
            setFlightFollowing(false);
            handleUpdateMapConfig('flightFollowing', false);
        },
    });

    return useMemo(() => (
        <LayersControl>
            <LayersControl.BaseLayer name='Open Topo' checked={selectedLayer.current === 'Open Topo'}>
                <TileLayer url={mapProvider.openTopo} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Open Street' checked={selectedLayer.current === 'Open Street'}>
                <TileLayer url={mapProvider.openStreet} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Dark' checked={selectedLayer.current === 'Dark'}>
                <TileLayer url={mapProvider.dark} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Google Street' checked={selectedLayer.current === 'Google Street'}>
                <TileLayer url={mapProvider.googleStreet} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Google Terrain' checked={selectedLayer.current === 'Google Terrain'}>
                <TileLayer url={mapProvider.googleTerrain} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Google Satellite' checked={selectedLayer.current === 'Google Satellite'}>
                <TileLayer url={mapProvider.googleSatellite} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Google Hybrid' checked={selectedLayer.current === 'Google Hybrid'}>
                <TileLayer url={mapProvider.googleHybrid} />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name='Aviation'>
                <TileLayer url={mapProvider.aviation} tms={true} detectRetina={true} subdomains='12' />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked={showFlightPlan} name='Flight Plan'>
                <LayerGroup id='lgFlightPlan' ref={layerGroupFlightPlan} />
            </LayersControl.Overlay>
        </LayersControl>
    ), [showFlightPlan, flightFollowing, layerGroupFlightPlan.current, waypoints])
}

export default MapDisplay;