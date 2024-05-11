import { District } from "./districts.types"
import { Municipal } from "./municipals.types"
import { Province } from "./provinces.types"

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
                    Municipal.ARJUNDHARA_MUNICIPALITY,
                    Municipal.AAMCHOWK_RURAL_MUNICIPALITY,
                    Municipal.HATUWAGADHI_RURAL_MUNICIPALITY,
                    Municipal.PAUWADUNGMA_RURAL_MUNICIPALITY,
                    Municipal.TEMKEMAIYUNG_RURAL_MUNICIPALITY,
                    Municipal.SALPASILICHHO_RURAL_MUNICIPALITY,
                    Municipal.RAMPRASAD_RAI_RURAL_MUNICIPALITY,
                    Municipal.SHADANANDA_MUNICIPALITY,
                    Municipal.BHOJPUR_MUNICIPALITY,
                ]
            },
            {
                name: District.DHANKUTA,
                municipals: [
                    Municipal.CHAUBISE_RURAL_MUNICIPALITY,
                    Municipal.SHAHIDBHUMI_RURAL_MUNICIPALITY,
                    Municipal.SANGURIGADHI_RURAL_MUNICIPALITY,
                    Municipal.CHHATHAR_JORPATI_RURAL_MUNICIPALITY,
                    Municipal.PAKHRIBAS_MUNICIPALITY,
                    Municipal.MAHALAXMI_MUNICIPALITY,
                    Municipal.DHANKUTA_MUNICIPALITY,
                ]
            },
            {
                name: District.ILAM,
                municipals: [
                    Municipal.RONG_RURAL_MUNICIPALITY,
                    Municipal.MANGSEBUNG_RURAL_MUNICIPALITY,
                    Municipal.CHULACHULI_RURAL_MUNICIPALITY,
                    Municipal.SANDAKPUR_RURAL_MUNICIPALITY,
                    Municipal.FAKPHOKTHUM_RURAL_MUNICIPALITY,
                    Municipal.MAIJOGMAI_RURAL_MUNICIPALITY,
                    Municipal.ILLAM_MUNICIPALITY,
                    Municipal.MAIJOGMAI_RURAL_MUNICIPALITY,
                    Municipal.DEUMAI_MUNICIPALITY,
                    Municipal.SURYODAYA_MUNICIPALITY,
                ]
            },
            {
                name: District.JHAPA,
                municipals: [
                    Municipal.KAMAL_RURAL_MUNICIPALITY,
                    Municipal.JHAPA_RURAL_MUNICIPALITY,
                    Municipal.KACHANKAWAL_RURAL_MUNICIPALITY,
                    Municipal.GAURIGANJ_RURAL_MUNICIPALITY,
                    Municipal.BARHADASHI_RURAL_MUNICIPALITY,
                    Municipal.HALDIBARI_RURAL_MUNICIPALITY,
                    Municipal.BUDDHASHANTI_RURAL_MUNICIPALITY,
                    Municipal.SHIVASATAXI_MUNICIPALITY,
                    Municipal.BHADRAPUR_MUNICIPALITY,
                    Municipal.KANKAI_MUNICIPALITY,
                    Municipal.BIRTAMOD_MUNICIPALITY,
                    Municipal.MECHINAGAR_MUNICIPALITY,
                    Municipal.DAMAK_MUNICIPALITY,
                    Municipal.ARJUNDHARA_MUNICIPALITY,
                    Municipal.GAURADHAHA_MUNICIPALITY,
                ]
            },
            {
                name: District.KHOTANG,
                municipals: [
                    Municipal.SAKELA_RURAL_MUNICIPALITY,
                    Municipal.KHOTEHANG_RURAL_MUNICIPALITY,
                    Municipal.BARAHAPOKHARI_RURAL_MUNICIPALITY,
                    Municipal.AINSELUKHARK_RURAL_MUNICIPALITY,
                    Municipal.RAWA_BESI_RURAL_MUNICIPALITY,
                    Municipal.KEPILASAGADHI_RURAL_MUNICIPALITY,
                    Municipal.JANTEDHUNGA_RURAL_MUNICIPALITY,
                    Municipal.DIPRUNG_CHUICHUMMA_RURAL_MUNICIPALITY,
                    Municipal.HALESI_TUWACHUNG_MUNICIPALITY,
                    Municipal.DIKTEL_RUPAKOT_MAJHUWAGADHI_MUNICIPALITY,
                ]
            },
            {
                name: District.MORANG,
                municipals: [
                    Municipal.JAHADA_RURAL_MUNICIPALITY,
                    Municipal.KATAHARI_RURAL_MUNICIPALITY,
                    Municipal.GRAMTHAN_RURAL_MUNICIPALITY,
                    Municipal.DHANPALTHAN_RURAL_MUNICIPALITY,
                    Municipal.KERABARI_RURAL_MUNICIPALITY,
                    Municipal.BUDHIGANGA_RURAL_MUNICIPALITY,
                    Municipal.KANEPOKHARI_RURAL_MUNICIPALITY,
                    Municipal.MIKLAJUNG_RURAL_MUNICIPALITY,
                    Municipal.LETANG_MUNICIPALITY,
                    Municipal.SUNWARSHI_MUNICIPALITY,
                    Municipal.RANGELI_MUNICIPALITY,
                    Municipal.PATAHRISHANISHCHARE_MUNICIPALITY,
                    Municipal.BIRATNAGAR_METROPOLITIAN_CITY,
                    Municipal.URALABARI_MUNICIPALITY,
                    Municipal.BELBARI_MUNICIPALITY,
                    Municipal.SUNDARHARAICHA_MUNICIPALITY,
                    Municipal.RATUWAMAI_MUNICIPALITY,
                ]
            },
            {
                name: District.OKHALDHUNGA,
                municipals: [
                    // Municipal.LIKHU,
                    Municipal.MOLUNG_RURAL_MUNICIPALITY,
                    Municipal.SUNKOSHI_RURAL_MUNICIPALITY,
                    Municipal.CHAMPADEVI_RURAL_MUNICIPALITY,
                    Municipal.CHISANKHUGADHI_RURAL_MUNICIPALITY,
                    Municipal.KHIJIDEMBA_RURAL_MUNICIPALITY,
                    Municipal.MANEBHANJYANG_RURAL_MUNICIPALITY,
                    Municipal.SIDDHICHARAN_MUNICIPALITY,
                ]
            },
            {
                name: District.PANCHTHAR,
                municipals: [
                    Municipal.YANGWARAK_RURAL_MUNICIPALITY,
                    Municipal.HILIHANG_RURAL_MUNICIPALITY,
                    Municipal.FALELUNG_RURAL_MUNICIPALITY,
                    Municipal.TUMBWEWA_RURAL_MUNICIPALITY,
                    Municipal.KUMMAYAK_RURAL_MUNICIPALITY,
                    Municipal.MIKLAJUNG_RURAL_MUNICIPALITY,
                    Municipal.FALGUNANDA_RURAL_MUNICIPALITY,
                    Municipal.PHIDIM_MUNICIPALITY,
                ]
            },
            {
                name: District.SANKHUWASABHA,
                municipals: [
                    Municipal.MAKALU_RURAL_MUNICIPALITY,
                    Municipal.CHICHILA_RURAL_MUNICIPALITY,
                    Municipal.SILICHONG_RURAL_MUNICIPALITY,
                    Municipal.BHOTKHOLA_RURAL_MUNICIPALITY,
                    Municipal.SABHAPOKHARI_RURAL_MUNICIPALITY,
                    Municipal.DHARMADEVI_MUNICIPALITY,
                    Municipal.MADI_MUNICIPALITY,
                    Municipal.PANCHAKHAPAN_MUNICIPALITY,
                    Municipal.CHAINPUR_MUNICIPALITY,
                    Municipal.KHANDBARI_MUNICIPALITY,
                ]
            },
            {
                name: District.SOLUKHUMBU,
                municipals: [
                    Municipal.SOTANG_RURAL_MUNICIPALITY,
                    Municipal.MAHAKULUNG_RURAL_MUNICIPALITY,
                    Municipal.LIKHUPIKE_RURAL_MUNICIPALITY,
                    Municipal.NECHASALYAN_RURAL_MUNICIPALITY,
                    Municipal.THULUNG_DUDHKOSHI_RURAL_MUNICIPALITY,
                    Municipal.MAAPYA_DUDHKOSHI_RURAL_MUNICIPALITY,
                    Municipal.KHUMBUPASANGLAHMU_RURAL_MUNICIPALITY,
                    Municipal.SOLUDUDHAKUNDA_MUNICIPALITY,
                ]
            },
            {
                name: District.SUNSARI,
                municipals: [
                    Municipal.GADHI_RURAL_MUNICIPALITY,
                    Municipal.KOSHI_RURAL_MUNICIPALITY,
                    Municipal.BARJU_RURAL_MUNICIPALITY,
                    Municipal.HARINAGAR_RURAL_MUNICIPALITY,
                    Municipal.DEWANGANJ_RURAL_MUNICIPALITY,
                    Municipal.BHOKRAHA_NARSING_RURAL_MUNICIPALITY,
                    Municipal.RAMDHUNI_MUNICIPALITY,
                    Municipal.BARAHCHHETRA_MUNICIPALITY,
                    Municipal.DUHABI_MUNICIPALITY,
                    Municipal.INARUWA_MUNICIPALITY,
                    Municipal.DHARAN_SUB_METROPOLITIAN_CITY,
                    Municipal.ITAHARI_SUB_METROPOLITIAN_CITY,
                ]
            },
            {
                name: District.TAPLEJUNG,
                municipals: [
                    Municipal.SIDINGBA_RURAL_MUNICIPALITY,
                    Municipal.MERINGDEN_RURAL_MUNICIPALITY,
                    Municipal.MAIWAKHOLA_RURAL_MUNICIPALITY,
                    Municipal.PHAKTANGLUNG_RURAL_MUNICIPALITY,
                    Municipal.SIRIJANGHA_RURAL_MUNICIPALITY,
                    Municipal.MIKWAKHOLA_RURAL_MUNICIPALITY,
                    Municipal.AATHRAI_TRIBENI_RURAL_MUNICIPALITY,
                    Municipal.PATHIVARA_YANGWARAK_RURAL_MUNICIPALITY,
                    Municipal.PHUNGLING_MUNICIPALITY,
                ]
            },
            {
                name: District.TEHRATHUM,
                municipals: [
                    Municipal.CHHATHAR_RURAL_MUNICIPALITY,
                    Municipal.PHEDAP_RURAL_MUNICIPALITY,
                    Municipal.AATHRAI_RURAL_MUNICIPALITY,
                    Municipal.MENCHAYAM_RURAL_MUNICIPALITY,
                    Municipal.LALIGURANS_MUNICIPALITY,
                    Municipal.MYANGLUNG_MUNICIPALITY,
                ]
            },
            {
                name: District.UDAYAPUR,
                municipals: [
                    Municipal.TAPLI_RURAL_MUNICIPALITY,
                    Municipal.RAUTAMAI_RURAL_MUNICIPALITY,
                    Municipal.UDAYAPURGADHI_RURAL_MUNICIPALITY,
                    Municipal.LIMCHUNGBUNG_RURAL_MUNICIPALITY,
                    Municipal.CHAUDANDIGADHI_MUNICIPALITY,
                    Municipal.TRIYUGA_MUNICIPALITY,
                    Municipal.KATARI_MUNICIPALITY,
                    Municipal.BELAKA_MUNICIPALITY,
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
                    Municipal.DHANKAUL_RURAL_MUNICIPALITY,
                    Municipal.PARSA_RURAL_MUNICIPALITY,
                    Municipal.BISHNUPUR_RURAL_MUNICIPALITY,
                    Municipal.RAMNAGAR_RURAL_MUNICIPALITY,
                    Municipal.KAUDENA_RURAL_MUNICIPALITY,
                    Municipal.BASBARIYA_RURAL_MUNICIPALITY,
                    Municipal.CHANDRANAGAR_RURAL_MUNICIPALITY,
                    Municipal.CHAKRAGHATTA_RURAL_MUNICIPALITY,
                    Municipal.BRAMHAPURI_RURAL_MUNICIPALITY,
                    Municipal.BARAHATHAWA_MUNICIPALITY,
                    Municipal.HARIPUR_MUNICIPALITY,
                    Municipal.ISHWORPUR_MUNICIPALITY,
                    Municipal.LALBANDI_MUNICIPALITY,
                    Municipal.MALANGAWA_MUNICIPALITY,
                    Municipal.KABILASI_MUNICIPALITY,
                    Municipal.BAGMATI_MUNICIPALITY,
                    Municipal.HARIWAN_MUNICIPALITY,
                    Municipal.BALARA_MUNICIPALITY,
                    Municipal.HARIPURWA_MUNICIPALITY,
                    Municipal.GODAITA_MUNICIPALITY,
                ]
            },
            {
                name: District.DHANUSHA,
                municipals: [
                    Municipal.AAURAHI_RURAL_MUNICIPALITY,
                    Municipal.DHANAUJI_RURAL_MUNICIPALITY,
                    Municipal.BATESHWOR_RURAL_MUNICIPALITY,
                    Municipal.JANAKNANDANI_RURAL_MUNICIPALITY,
                    Municipal.LAKSHMINIYA_RURAL_MUNICIPALITY,
                    Municipal.MUKHIYAPATTI_MUSARMIYA_RURAL_MUNICIPALITY,
                    Municipal.MITHILA_BIHARI_MUNICIPALITY,
                    Municipal.KAMALA_MUNICIPALITY,
                    Municipal.NAGARAIN_MUNICIPALITY,
                    Municipal.GANESMAN_CHARNATH_MUNICIPALITY,
                    Municipal.MITHILA_MUNICIPALITY,
                    Municipal.DHANUSADHAM_MUNICIPALITY,
                    Municipal.BIDEHA_MUNICIPALITY,
                    Municipal.SABAILA_MUNICIPALITY,
                    Municipal.HANSAPUR_MUNICIPALITY,
                    Municipal.JANAKPURDHAM_SUB_METROPOLITIAN_CITY,
                    Municipal.SAHIDNAGAR_MUNICIPALITY,
                    Municipal.CHHIRESHWORNATH_MUNICIPALITY,
                ]
            },
            {
                name: District.BARA,
                municipals: [
                    Municipal.PHETA_RURAL_MUNICIPALITY,
                    Municipal.DEVTAL_RURAL_MUNICIPALITY,
                    Municipal.PRASAUNI_RURAL_MUNICIPALITY,
                    Municipal.SUWARNA_RURAL_MUNICIPALITY,
                    Municipal.BARAGADHI_RURAL_MUNICIPALITY,
                    Municipal.KARAIYAMAI_RURAL_MUNICIPALITY,
                    Municipal.PARWANIPUR_RURAL_MUNICIPALITY,
                    Municipal.BISHRAMPUR_RURAL_MUNICIPALITY,
                    Municipal.ADARSHKOTWAL_RURAL_MUNICIPALITY,
                    Municipal.JITPUR_SIMARA_SUB_METROPOLITIAN_CITY,
                    Municipal.KALAIYA_SUB_METROPOLITIAN_CITY,
                    Municipal.PACHARAUTA_MUNICIPALITY,
                    Municipal.NIJGADH_MUNICIPALITY,
                    Municipal.SIMRAUNGADH_MUNICIPALITY,
                    Municipal.MAHAGADHIMAI_MUNICIPALITY,
                    Municipal.KOLHABI_MUNICIPALITY,
                ]
            },
            {
                name: District.RAUTAHAT,
                municipals: [
                    Municipal.YEMUNAMAI_RURAL_MUNICIPALITY,
                    Municipal.DURGA_BHAGWATI_RURAL_MUNICIPALITY,
                    Municipal.KATAHARIYA_MUNICIPALITY,
                    Municipal.MAULAPUR_MUNICIPALITY,
                    Municipal.MADHAV_NARAYAN_MUNICIPALITY,
                    Municipal.GAURADHAHA_MUNICIPALITY,
                    Municipal.GUJARA_MUNICIPALITY,
                    Municipal.GARUDA_MUNICIPALITY,
                    Municipal.ISHANATH_MUNICIPALITY,
                    Municipal.CHANDRAPUR_MUNICIPALITY,
                    Municipal.DEWAHHI_GONAHI_MUNICIPALITY,
                    Municipal.BRINDABAN_MUNICIPALITY,
                    Municipal.RAJPUR_MUNICIPALITY,
                    Municipal.RAJDEVI_MUNICIPALITY,
                    Municipal.GADHIMAI_MUNICIPALITY,
                    Municipal.PHATUWA_BIJAYAPUR_MUNICIPALITY,
                    Municipal.BAUDHIMAI_MUNICIPALITY,
                    Municipal.PAROHA_MUNICIPALITY,
                ]
            },
            {
                name: District.SAPTARI,
                municipals: [
                    Municipal.RAJGADH_RURAL_MUNICIPALITY,
                    Municipal.RUPANI_RURAL_MUNICIPALITY,
                    Municipal.TIRAHUT_RURAL_MUNICIPALITY,
                    Municipal.MAHADEVA_RURAL_MUNICIPALITY,
                    Municipal.BISHNUPUR_RURAL_MUNICIPALITY,
                    Municipal.CHHINNAMASTA_RURAL_MUNICIPALITY,
                    Municipal.BALAN_BIHUL_RURAL_MUNICIPALITY,
                    Municipal.TILATHI_KOILADI_RURAL_MUNICIPALITY,
                    Municipal.AGNISAIR_KRISHNA_SAVARAN_RURAL_MUNICIPALITY,
                    Municipal.HANUMANNAGAR_KANKALINI_MUNICIPALITY,
                    Municipal.KANCHANRUP_MUNICIPALITY,
                    Municipal.RAJBIRAJ_MUNICIPALITY,
                    Municipal.KHADAK_MUNICIPALITY,
                    Municipal.DAKNESHWORI_MUNICIPALITY,
                    Municipal.SAPTAKOSHI_RURAL_MUNICIPALITY,
                    Municipal.SURUNGA_MUNICIPALITY,
                    Municipal.SHAMBHUNATH_MUNICIPALITY,
                    Municipal.BODE_BARSAIN_MUNICIPALITY,
                ]
            },
            {
                name: District.SIRAHA,
                municipals: [
                    Municipal.AURAHI_RURAL_MUNICIPALITY,
                    Municipal.NARAHA_RURAL_MUNICIPALITY,
                    Municipal.ARNAMA_RURAL_MUNICIPALITY,
                    Municipal.BHAGAWANPUR_RURAL_MUNICIPALITY,
                    Municipal.NAWARAJPUR_RURAL_MUNICIPALITY,
                    Municipal.BISHNUPUR_RURAL_MUNICIPALITY,
                    Municipal.BARIYARPATTI_RURAL_MUNICIPALITY,
                    Municipal.LAXMIPUR_PATARI_RURAL_MUNICIPALITY,
                    Municipal.SAKHUWANANKARKATTI_RURAL_MUNICIPALITY,
                    Municipal.MIRCHAIYA_MUNICIPALITY,
                    Municipal.LAHAN_MUNICIPALITY,
                    Municipal.SIRAHA_MUNICIPALITY,
                    Municipal.DHANGADHIMAI_MUNICIPALITY,
                    Municipal.KALYANPUR_MUNICIPALITY,
                    Municipal.KARJANHA_MUNICIPALITY,
                    Municipal.GOLBAZAR_MUNICIPALITY,
                    Municipal.SUKHIPUR_MUNICIPALITY,
                ]
            },
            {
                name: District.MAHOTTARI,
                municipals: [
                    Municipal.PIPRA_RURAL_MUNICIPALITY,
                    Municipal.SONAMA_RURAL_MUNICIPALITY,
                    Municipal.SAMSI_RURAL_MUNICIPALITY,
                    Municipal.EKDANRA_RURAL_MUNICIPALITY,
                    Municipal.MAHOTTARI_RURAL_MUNICIPALITY,
                    Municipal.GAUSHALA_MUNICIPALITY,
                    Municipal.RAMGOPALPUR_MUNICIPALITY,
                    Municipal.AURAHI_MUNICIPALITY,
                    Municipal.BARDIBAS_MUNICIPALITY,
                    Municipal.BHANGAHA_MUNICIPALITY,
                    Municipal.JALESWOR_MUNICIPALITY,
                    Municipal.BALWA_MUNICIPALITY,
                    Municipal.MANRA_SISWA_MUNICIPALITY,
                    Municipal.MATIHANI_MUNICIPALITY,
                    Municipal.LOHARPATTI_MUNICIPALITY,
                ]
            },
            {
                name: District.PARSA,
                municipals: [
                    Municipal.THORI_RURAL_MUNICIPALITY,
                    Municipal.DHOBINI_RURAL_MUNICIPALITY,
                    Municipal.CHHIPAHARMAI_RURAL_MUNICIPALITY,
                    Municipal.JIRABHAWANI_RURAL_MUNICIPALITY,
                    Municipal.JAGARNATHPUR_RURAL_MUNICIPALITY,
                    Municipal.KALIKAMAI_RURAL_MUNICIPALITY,
                    Municipal.BINDABASINI_RURAL_MUNICIPALITY,
                    Municipal.PAKAHAMAINPUR_RURAL_MUNICIPALITY,
                    Municipal.SAKHUWAPRASAUNI_RURAL_MUNICIPALITY,
                    Municipal.PATERWASUGAULI_RURAL_MUNICIPALITY,
                    Municipal.BIRGUNJ_METROPOLITIAN_CITY,
                    Municipal.BAHUDARAMAI_MUNICIPALITY,
                    Municipal.POKHARIYA_MUNICIPALITY,
                    Municipal.PARSAGADHI_MUNICIPALITY,
                ]
            }
        ]
    }
]