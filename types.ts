export interface MarkerType {
    id: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    images: string[];
};

interface Image {
    id: string;
    id_m: number;
    uri: string[];
}