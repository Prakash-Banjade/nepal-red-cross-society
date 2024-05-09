import { Municipal } from "./municipals.types"

export enum Province {
    KOSHI = 'Koshi',
    MADHESH = 'Madhesh',
    BAGMATI = 'Bagmati',
    GANDAKI = 'Gandaki',
    LUMBINI = 'Lumbini',
    KARNALI = 'Karnali',
    SUDURPASHCHIM = 'Sudurpashchim',
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
        municipals: Municipal[]
    }[]
}

export const addresses: Address[] = [
    {
        province: Province.KOSHI,
        districts: [
            {
                name: District.BHOJPUR,
                municipals: [
                    Municipal.ARUN,
                    Municipal.AAMCHOWK,
                    Municipal.HATUWAGADHI,
                    Municipal.PAUWADUNGMA,
                    Municipal.TEMKEMAIYUNG,
                    Municipal.SALPASILICHHO,
                    Municipal.RAMPRASADRAI,
                    Municipal.SHADANANDA,
                    Municipal.BHOJPUR,
                ]
            },
            {
                name: District.DHANKUTA,
                municipals: [
                    Municipal.CHAUBISE,
                    Municipal.SHAIDBHUMI,
                    Municipal.SANGURIGADHI,
                    Municipal.CHHATHARJORPATI,
                    Municipal.PAKHRIBAS,
                    Municipal.MAHALAXMI,
                    Municipal.DHANKUTA,
                ]
            },
            {
                name: District.ILAM,
                municipals: [
                    Municipal.RONG,
                    Municipal.MANGSEBUNG,
                    Municipal.CHULACHULI,
                    Municipal.SANDAKPUR,
                    Municipal.FAKPHOKTHUM,
                    Municipal.MAIJOGMAI,
                    Municipal.ILLAM,
                    Municipal.MAI,
                    Municipal.DEUMAI,
                    Municipal.SURYODAYA,
                ]
            },
            {
                name: District.JHAPA,
                municipals: [
                    Municipal.KAMAL,
                    Municipal.JHAPA_RURAL,
                    Municipal.KACHANKAWAL,
                    Municipal.GAURIGANJ,
                    Municipal.BARHADASHI,
                    Municipal.HALDIBARI,
                    Municipal.BUDDHASHANTI,
                    Municipal.SHIVASATAXI,
                    Municipal.BHADRAPUR,
                    Municipal.KANKAI,
                    Municipal.BIRTAMOD,
                    Municipal.MECHINAGAR,
                    Municipal.DAMAK,
                    Municipal.ARJUNDHARA,
                    Municipal.GAURADHAHA,
                ]
            },
            {
                name: District.KHOTANG,
                municipals: [
                    Municipal.SAKELA,
                    Municipal.KHOTEHANG,
                    Municipal.BARAHAPOKHARI,
                    Municipal.AINSELUKHARK,
                    Municipal.RAWABESI,
                    Municipal.KEPILASAGADHI,
                    Municipal.JANTEDHUNGA,
                    Municipal.DIPRUNGCHUICHUMMA,
                    Municipal.HALESITUWACHUNG,
                    Municipal.DIKTELRUPAKOTMAJHUWAGADHI,
                ]
            },
            {
                name: District.MORANG,
                municipals: [
                    Municipal.JAHADA,
                    Municipal.KATAHARI,
                    Municipal.GRAMTHAN,
                    Municipal.DHANPALTHAN,
                    Municipal.KERABARI,
                    Municipal.BUDHIGANGA,
                    Municipal.KANEPOKHARI,
                    Municipal.MIKLAJUNG,
                    Municipal.LETANG,
                    Municipal.SUNWARSHI,
                    Municipal.RANGELI,
                    Municipal.PATAHRISHANISHCHARE,
                    Municipal.BIRATNAGAR,
                    Municipal.URALABARI,
                    Municipal.BELBARI,
                    Municipal.SUNDARHARAICHA,
                    Municipal.RATUWAMAI,
                ]
            },
            {
                name: District.OKHALDHUNGA,
                municipals: [
                    Municipal.LIKHU,
                    Municipal.MOLUNG,
                    Municipal.SUNKOSHI,
                    Municipal.CHAMPADEVI,
                    Municipal.CHISANKHUGADHI,
                    Municipal.KHIJIDEMBA,
                    Municipal.MANEBHANJYANG,
                    Municipal.SIDDHICHARAN,
                ]
            },
            {
                name: District.PANCHTHAR,
                municipals: [
                    Municipal.YANGWARAK,
                    Municipal.HILIHANG,
                    Municipal.FALELUNG,
                    Municipal.TUMBWEWA,
                    Municipal.KUMMAYAK,
                    Municipal.MIKLAJUNG_1,
                    Municipal.FALGUNANDA,
                    Municipal.PHIDIM,
                ]
            },
            {
                name: District.SANKHUWASABHA,
                municipals: [
                    Municipal.MAKALU,
                    Municipal.CHICHILA,
                    Municipal.SILICHONG,
                    Municipal.BHOTKHOLA,
                    Municipal.SABHAPOKHARI,
                    Municipal.DHARMADEVI,
                    Municipal.MADI,
                    Municipal.PANCHAKHAPAN,
                    Municipal.CHAINPUR,
                    Municipal.KHANDBARI,
                ]
            },
            {
                name: District.SOLUKHUMBU,
                municipals: [
                    Municipal.SOTANG,
                    Municipal.MAHAKULUNG,
                    Municipal.LIKHUPIKE,
                    Municipal.NECHASALYAN,
                    Municipal.THULUNG_DUDHKOSHI,
                    Municipal.MAAPYA_DUDHKOSHI,
                    Municipal.KHUMBUPASANGLAHMU,
                    Municipal.SOLUDUDHAKUNDA,
                ]
            },
            {
                name: District.SUNSARI,
                municipals: [
                    Municipal.GADHI,
                    Municipal.KOSHI,
                    Municipal.BARJU,
                    Municipal.HARINAGAR,
                    Municipal.DEWANGANJ,
                    Municipal.BHOKRAHA_NARSING,
                    Municipal.RAMDHUNI,
                    Municipal.BARAHCHHETRA,
                    Municipal.DUHABI,
                    Municipal.INARUWA,
                    Municipal.DHARAN,
                    Municipal.ITAHARI,
                ]
            },
            {
                name: District.TAPLEJUNG,
                municipals: [
                    Municipal.SIDINGBA,
                    Municipal.MERINGDEN,
                    Municipal.MAIWAKHOLA,
                    Municipal.PHAKTANGLUNG,
                    Municipal.SIRIJANGHA,
                    Municipal.MIKWAKHOLA,
                    Municipal.AATHRAI_TRIBENI,
                    Municipal.PATHIVARA_YANGWARAK,
                    Municipal.PHUNGLING,
                ]
            },
            {
                name: District.TEHRATHUM,
                municipals: [
                    Municipal.CHHATHAR,
                    Municipal.PHEDAP,
                    Municipal.AATHRAI,
                    Municipal.MENCHAYAM,
                    Municipal.LALIGURANS,
                    Municipal.MYANGLUNG,
                ]
            },
            {
                name: District.UDAYAPUR,
                municipals: [
                    Municipal.TAPLI,
                    Municipal.RAUTAMAI,
                    Municipal.UDAYAPURGADHI,
                    Municipal.LIMCHUNGBUNG,
                    Municipal.CHAUDANDIGADHI,
                    Municipal.TRIYUGA,
                    Municipal.KATARI,
                    Municipal.BELAKA,
                ]
            }

        ]
    },
    {
        province: Province.MADHESH,
        districts: [
            {
                name: District.SARLAHI,
                municipals: [
                    Municipal.DHANKAUL,
                    Municipal.PARSA,
                    Municipal.BISHNU,
                    Municipal.RAMNAGAR,
                    Municipal.KAUDENA,
                    Municipal.BASBARIYA,
                    Municipal.CHANDRANAGAR,
                    Municipal.CHAKRAGHATTA,
                    Municipal.BRAMHAPURI,
                    Municipal.BARAHATHAWA,
                    Municipal.HARIPUR,
                    Municipal.ISHWORPUR,
                    Municipal.LALBANDI,
                    Municipal.MALANGAWA,
                    Municipal.KABILASI,
                    Municipal.BAGMATI,
                    Municipal.HARIWAN,
                    Municipal.BALARA,
                    Municipal.HARIPURWA,
                    Municipal.GODAITA,
                ]
            },
            {
                name: District.DHANUSHA,
                municipals: [
                    Municipal.AAURAHI,
                    Municipal.DHANAUJI,
                    Municipal.BATESHWOR,
                    Municipal.JANAKNANDANI,
                    Municipal.LAKSHMINIYA,
                    Municipal.MUKHIYAPATTI_MUSARMIYA,
                    Municipal.MITHILA_BIHARI,
                    Municipal.KAMALA,
                    Municipal.NAGARAIN,
                    Municipal.GANESHMAN_CHARNATH,
                    Municipal.MITHILA,
                    Municipal.DHANUSADHAM,
                    Municipal.BIDEHA,
                    Municipal.SABAILA,
                    Municipal.HANSAPUR,
                    Municipal.JANAKPURDHAM_SUB_METROPOLITIAN,
                    Municipal.SAHIDNAGAR,
                    Municipal.CHHIRESHWORNATH,
                ]
            },
            {
                name: District.BARA,
                municipals: [
                    Municipal.PHETA,
                    Municipal.DEVTAL,
                    Municipal.PRASAUNI,
                    Municipal.SUWARNA,
                    Municipal.BARAGADHI,
                    Municipal.KARAIYAMAI,
                    Municipal.PARWANIPUR,
                    Municipal.BISHRAMPUR,
                    Municipal.ADARSHKOTWAL,
                    Municipal.JITPUR_SIMARA_SUB_METROPOLITIAN,
                    Municipal.KALAIYA_SUB_METROPOLITIAN,
                    Municipal.PACHARAUTA,
                    Municipal.NIJGADH,
                    Municipal.SIMRAUNGADH,
                    Municipal.MAHAGADHIMAI,
                    Municipal.KOLHABI,
                ]
            },
            {
                name: District.RAUTAHAT,
                municipals: [
                    Municipal.YEMUNAMAI,
                    Municipal.DURGA_BHAGWATI,
                    Municipal.KATAHARIYA,
                    Municipal.MAULAPUR,
                    Municipal.MADHAV_NARAYAN,
                    Municipal.GAUR,
                    Municipal.GUJARA,
                    Municipal.GARUDA,
                    Municipal.ISHANATH,
                    Municipal.CHANDRAPUR,
                    Municipal.DEWAHHI_GONAHI,
                    Municipal.BRINDABAN,
                    Municipal.RAJPUR,
                    Municipal.RAJDEVI,
                    Municipal.GADHIMAI,
                    Municipal.PHATUWA_BIJAYAPUR,
                    Municipal.BAUDHIMAI,
                    Municipal.PAROHA,
                ]
            },
            {
                name: District.SAPTARI,
                municipals: [
                    Municipal.RAJGADH,
                    Municipal.RUPANI,
                    Municipal.TIRAHIUT,
                    Municipal.MAHADEVA,
                    Municipal.BISHNUPUR_RURAL,
                    Municipal.CHHINNAMASTA,
                    Municipal.BALAN_BIHUL,
                    Municipal.TILATHI_KOILADI,
                    Municipal.AGNISAIR_KRISHNA_SAVARAN,
                    Municipal.HANUMANNAGAR_KANKALINI,
                    Municipal.KANCHANRUP,
                    Municipal.RAJBIRAJ,
                    Municipal.KHADAK,
                    Municipal.DAKNESHWORI,
                    Municipal.SAPTAKOSHI,
                    Municipal.SURUNGA,
                    Municipal.SHAMBHUNATH,
                    Municipal.BODE_BARSAIN,
                ]
            },
            {
                name: District.SIRAHA,
                municipals: [
                    Municipal.AURAHI_Rural,
                    Municipal.NARAHA,
                    Municipal.ARNAMA,
                    Municipal.BHAGAWANPUR,
                    Municipal.NAWARAJPUR,
                    Municipal.BISHNUPUR,
                    Municipal.BARIYARPATTI,
                    Municipal.LAXMIPUR_PATARI,
                    Municipal.SAKHUWANANKARKATTI,
                    Municipal.MIRCHAIYA,
                    Municipal.LAHAN,
                    Municipal.SIRAHA,
                    Municipal.DHANGADHIMAI,
                    Municipal.KALYANPUR,
                    Municipal.KARJANHA,
                    Municipal.GOLBAZAR,
                    Municipal.SUKHIPUR,
                ]
            },
            {
                name: District.MAHOTTARI,
                municipals: [
                    Municipal.PIPRA,
                    Municipal.SONAMA,
                    Municipal.SAMSI,
                    Municipal.EKDANRA,
                    Municipal.MAHOTTARI,
                    Municipal.GAUSHALA,
                    Municipal.RAMGOPALPUR,
                    Municipal.AURAHI,
                    Municipal.BARDIBAS,
                    Municipal.BHANGAHA,
                    Municipal.JALESWOR,
                    Municipal.BALWA,
                    Municipal.MANRA_SISWA,
                    Municipal.MATIHANI,
                    Municipal.LOHARPATTI,
                ]
            },
            {
                name: District.PARSA,
                municipals: [
                    Municipal.THORI,
                    Municipal.DHOBINI,
                    Municipal.CHHIPAHARMAI,
                    Municipal.JIRABHAWANI,
                    Municipal.JAGARNATHPUR,
                    Municipal.KALIKAMAI,
                    Municipal.BINDABASINI,
                    Municipal.PAKAHAMAINPUR,
                    Municipal.SAKHUWAPRASAUNI,
                    Municipal.PATERWASUGAULI,
                    Municipal.BIRGUNJ_METROPOLITIAN_CITY,
                    Municipal.BAHUDARAMAI,
                    Municipal.POKHARIYA,
                    Municipal.PARSAGADHI,
                ]
            }
        ]
    }
]