export function formatLocationName(location: {
    name: string;
    admin1?: string;
    country: string;
}): string {
    const admin = location.admin1 && location.admin1 !== location.name
        ? `, ${location.admin1}`
        : "";
    return `${location.name}${admin}, ${location.country}`;
}
