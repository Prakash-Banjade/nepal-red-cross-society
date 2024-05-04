export enum Province {
    KOSHI = 'koshi',
    MADHESH = 'madhesh',
    BAGMATI = 'bagmati',
    GANDAKI = 'gandaki',
    LUMBINI = 'lumbini',
    KARNALI = 'karnali',
    SUDURPASHCHIM = 'sudurpashchim',
}

export enum District {
    // Koshi
    BHOJPUR = "Bhojpur",
    DHANKUTA = "Dhankuta",
    ILAM = "Ilam",
    JHAPA = "Jhapa",
    KHOTANG = "Khotang",
    MORANG = "Morang",
    OKHALDHUNGA = "Okhaldhunga",
    PANCHTHAR = "Panchthar",
    SANKHUWASABHA = "Sankhuwasabha",
    SOLUKHUMBU = "Solukhumbu",
    SUNSARI = "Sunsari",
    TAPLEJUNG = "Taplejung",
    TEHRATHUM = "Tehrathum",
    UDAYAPUR = "Udayapur",

    // Madhesh
    SARLAHI = "Sarlahi",
    DHANUSHA = "Dhanusha",
    BARA = "Bara",
    RAUTAHAT = "Rautahat",
    SAPTARI = "Saptari",
    SIRAHA = "Siraha",
    MAHOTTARI = "Mahottari",
    PARSA = "Parsa",

    // Bagmati
    SINDHULI = "Sindhuli",
    RAMECHHAP = "Ramechhap",
    DOLAKHA = "Dolakha",
    BHAKTAPUR = "Bhaktapur",
    DHADING = "Dhading",
    KATHMANDU = "Kathmandu",
    KAVREPALANCHOK = "Kavrepalanchok",
    LALITPUR = "Lalitpur",
    NUWAKOT = "Nuwakot",
    RASUWA = "Rasuwa",
    SINDHUPALCHOK = "Sindhupalchok",
    CHITWAN = "Chitwan",
    MAKWANPUR = "Makwanpur",

    // Gandaki
    BAGLUNG = "Baglung",
    GORKHA = "Gorkha",
    KASKI = "Kaski",
    LAMJUNG = "Lamjung",
    MANANG = "Manang",
    MUSTANG = "Mustang",
    MYAGDI = "Myagdi",
    NAWALPUR = "Nawalpur",
    PARBAT = "Parbat",
    SYANGJA = "Syangja",
    TANAHUN = "Tanahun",

    // Lumbini
    KAPILVASTU = "Kapilvastu",
    PARASI = "Parasi",
    RUPANDEHI = "Rupandehi",
    ARGHAKHANCHI = "Arghakhanchi",
    GULMI = "Gulmi",
    PALPA = "Palpa",
    DANG = "Dang",
    PYUTHAN = "Pyuthan",
    ROLPA = "Rolpa",
    EASTERN_RUKUM = "Eastern Rukum",
    BANKE = "Banke",
    BARDIYA = "Bardiya",

    // Karnali
    WESTERN_RUKUM = "Western Rukum",
    SALYAN = "Salyan",
    DOLPA = "Dolpa",
    HUMLA = "Humla",
    JUMLA = "Jumla",
    KALIKOT = "Kalikot",
    MUGU = "Mugu",
    SURKHET = "Surkhet",
    DAILEKH = "Dailekh",
    JAJARKOT = "Jajarkot",

    // Sudurpashchim
    ACHHAM = "Achham",
    BAITADI = "Baitadi",
    BAJHANG = "Bajhang",
    BAJURA = "Bajura",
    DADELDHURA = "Dadeldhura",
    DARCHULA = "Darchula",
    DOTI = "Doti",
    KAILALI = "Kailali",
    KANCHANPUR = "Kanchanpur",
}

export interface Address {
    province: Province,
    districts: {
        name: District,
        municipals: string[]
    }[]
}

export const addresses: Address[] = [
    {
        province: Province.KOSHI,
        districts: [
            {
                name: District.BHOJPUR,
                municipals: []
            },
            {
                name: District.DHANKUTA,
                municipals: []
            },
            {
                name: District.ILAM,
                municipals: []
            },
            {
                name: District.JHAPA,
                municipals: []
            },
            {
                name: District.KHOTANG,
                municipals: []
            },
            {
                name: District.MORANG,
                municipals: []
            },
            {
                name: District.OKHALDHUNGA,
                municipals: []
            },
            {
                name: District.PANCHTHAR,
                municipals: []
            },
            {
                name: District.SANKHUWASABHA,
                municipals: []
            },
            {
                name: District.SOLUKHUMBU,
                municipals: []
            },
            {
                name: District.SUNSARI,
                municipals: []
            },
            {
                name: District.TAPLEJUNG,
                municipals: []
            },
            {
                name: District.TEHRATHUM,
                municipals: []
            },
            {
                name: District.UDAYAPUR,
                municipals: []
            }

        ]
    },
    {
        province: Province.MADHESH,
        districts: [
            {
                name: District.SARLAHI,
                municipals: []
            },
            {
                name: District.DHANUSHA,
                municipals: []
            },
            {
                name: District.BARA,
                municipals: []
            },
            {
                name: District.RAUTAHAT,
                municipals: []
            },
            {
                name: District.SAPTARI,
                municipals: []
            },
            {
                name: District.SIRAHA,
                municipals: []
            },
            {
                name: District.MAHOTTARI,
                municipals: []
            },
            {
                name: District.PARSA,
                municipals: []
            }
        ]
    }
]