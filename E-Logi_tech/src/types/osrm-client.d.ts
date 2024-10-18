// declare module 'osrm-client' {
//   interface OSRMClientOptions {
//     baseUrl?: string;
//   }

//   interface RouteOptions {
//     coordinates: [number, number][];
//     alternatives?: boolean;
//     steps?: boolean;
//     annotations?: boolean;
//     geometries?: 'polyline' | 'polyline6' | 'geojson';
//     overview?: 'simplified' | 'full' | 'false';
//     continue_straight?: boolean;
//   }

//   interface RouteResponse {
//     code: string;
//     routes: Array<{
//       geometry: {
//         coordinates: [number, number][];
//         type: string;
//       };
//       legs: Array<{
//         steps: Array<{
//           geometry: {
//             coordinates: [number, number][];
//             type: string;
//           };
//           maneuver: {
//             location: [number, number];
//             type: string;
//             modifier: string;
//           };
//           name: string;
//           duration: number;
//           distance: number;
//         }>;
//         summary: string;
//         weight: number;
//         duration: number;
//         distance: number;
//       }>;
//       weight_name: string;
//       weight: number;
//       duration: number;
//       distance: number;
//     }>;
//     waypoints: Array<{
//       location: [number, number];
//       name: string;
//     }>;
//   }

//   class OSRMClient {
//     constructor(baseUrl: string, options?: OSRMClientOptions);
//     route(options: RouteOptions, callback: (err: Error | null, result: RouteResponse) => void): void;
//   }

//   export = OSRMClient;
// }