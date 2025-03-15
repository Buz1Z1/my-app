export interface MarkerData {
    id: string;
    latitude: number;
    longitude: number;
    date: string;
};

export interface ImageData {
    id: string;
    marker_id: number;
    uri: string;
}