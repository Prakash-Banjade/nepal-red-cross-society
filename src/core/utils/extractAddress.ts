import { Country } from "../types/country.types";
import { Province } from "../types/provinces.types";
import { District } from "../types/districts.types";
import { Municipal } from "../types/municipals.types";

interface Address {
    country?: Country;
    province?: Province;
    district?: District;
    municipality?: Municipal;
    ward?: number;
    street?: string;
}

export const extractAddress = <T extends Address>(dto: T) => {
    const { country, province, district, municipality, ward, street } = dto;
    return { country, province, district, municipality, ward, street };
}