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
    },
    {
        province: Province.BAGMATI,
        districts: [
            {
                name: District.SINDHULI,
                municipals: [
                    Municipal.MARIN_RURAL_MUNICIPALITY,
                    Municipal.PHIKKAL_RURAL_MUNICIPALITY,
                    Municipal.TINPATAN_RURAL_MUNICIPALITY,
                    Municipal.SUNKOSHI_RURAL_MUNICIPALITY,
                    Municipal.GOLANJOR_RURAL_MUNICIPALITY,
                    Municipal.GHANGLEKH_RURAL_MUNICIPALITY,
                    Municipal.HARIHARPURGADHI_RURAL_MUNICIPALITY,
                    Municipal.DUDHOULI_MUNICIPALITY,
                    Municipal.KAMALAMAI_MUNICIPALITY,
                    Municipal.KHANDEVI_RURAL_MUNICIPALITY,
                    Municipal.DORAMBA_RURAL_MUNICIPALITY,
                    Municipal.GOKULGANGA_RURAL_MUNICIPALITY,
                    Municipal.LIKHUTAMAKOSHI_RURAL_MUNICIPALITY,
                    Municipal.SUNAPATI_RURAL_MUNICIPALITY
                ]
            },
            {
                name: District.RAMECHHAP,
                municipals: [
                    Municipal.MANTHALI_MUNICIPALITY,
                    Municipal.RAMECHHAP_MUNICIPALITY,
                    Municipal.UMAKUNDA_RURAL_MUNICIPALITY,
                    Municipal.KHANDEVI_RURAL_MUNICIPALITY,
                    Municipal.DORAMBA_RURAL_MUNICIPALITY,
                    Municipal.GOKULGANGA_RURAL_MUNICIPALITY,
                    Municipal.LIKHUTAMAKOSHI_RURAL_MUNICIPALITY,
                    Municipal.SUNAPATI_RURAL_MUNICIPALITY
                ]
            },
            {
                name: District.DOLAKHA,
                municipals: [
                    Municipal.BHIMESHWOR_MUNICIPALITY,
                    Municipal.JIRI_MUNICIPALITY,
                    Municipal.KALINCHOK_RURAL_MUNICIPALITY,
                    Municipal.MELUNG_RURAL_MUNICIPALITY,
                    Municipal.BIGU_RURAL_MUNICIPALITY,
                    Municipal.GAURISHANKAR_RURAL_MUNICIPALITY,
                    Municipal.BAITESHWOR_RURAL_MUNICIPALITY,
                    Municipal.SAILUNG_RURAL_MUNICIPALITY,
                    Municipal.TAMAKOSHI_RURAL_MUNICIPALITY
                ]
            },
            {
                name: District.BHAKTAPUR,
                municipals: [
                    Municipal.CHANGUNARAYAN_MUNICIPALITY,
                    Municipal.SURYABINAYAK_MUNICIPALITY,
                    Municipal.BHAKTAPUR_MUNICIPALITY,
                    Municipal.MADHYAPUR_THIMI_MUNICIPALITY
                ]
            },
            {
                name: District.DHADING,
                municipals: [
                    Municipal.GAJURI_RURAL_MUNICIPALITY,
                    Municipal.GALCHI_RURAL_MUNICIPALITY,
                    Municipal.THAKRE_RURAL_MUNICIPALITY,
                    Municipal.SIDDHALEK_RURAL_MUNICIPALITY,
                    Municipal.KHANIYABASH_RURAL_MUNICIPALITY,
                    Municipal.JWALAMUKHI_RURAL_MUNICIPALITY,
                    Municipal.GANGAJAMUNA_RURAL_MUNICIPALITY,
                    Municipal.RUBI_VALLEY_RURAL_MUNICIPALITY,
                    Municipal.TRIPURA_SUNDARI_RURAL_MUNICIPALITY,
                    Municipal.NETRAWATI_DABJONG_RURAL_MUNICIPALITY,
                    Municipal.BENIGHAT_RORANG_RURAL_MUNICIPALITY,
                    Municipal.NILAKANTHA_MUNICIPALITY,
                    Municipal.DHUNIBESI_MUNICIPALITY
                ]
            },
            {
                name: District.KATHMANDU,
                municipals: [
                    Municipal.KIRTIPUR_MUNICIPALITY,
                    Municipal.SHANKHARAPUR_MUNICIPALITY,
                    Municipal.NAGARJUN_MUNICIPALITY,
                    Municipal.KAGESHWORI_MANAHORA_MUNICIPALITY,
                    Municipal.DAKSHINKALI_MUNICIPALITY,
                    Municipal.BUDHANILKANTHA_MUNICIPALITY,
                    Municipal.TARAKESHWOR_MUNICIPALITY,
                    Municipal.KATHMANDU_METROPOLITAN_CITY,
                    Municipal.TOKHA_MUNICIPALITY,
                    Municipal.CHANDRAGIRI_MUNICIPALITY,
                    Municipal.GOKARNESHWOR_MUNICIPALITY
                ]
            },
            {
                name: District.KAVREPALANCHOK,
                municipals: [
                    Municipal.ROSHI_RURAL_MUNICIPALITY,
                    Municipal.TEMAL_RURAL_MUNICIPALITY,
                    Municipal.BHUMLU_RURAL_MUNICIPALITY,
                    Municipal.MAHABHARAT_RURAL_MUNICIPALITY,
                    Municipal.BETHANCHOWK_RURAL_MUNICIPALITY,
                    Municipal.KHANIKHOLA_RURAL_MUNICIPALITY,
                    Municipal.CHAURIDEURALI_RURAL_MUNICIPALITY,
                    Municipal.BANEPA_MUNICIPALITY,
                    Municipal.MANDANDEUPUR_MUNICIPALITY,
                    Municipal.DHULIKHEL_MUNICIPALITY,
                    Municipal.PANAUTI_MUNICIPALITY,
                    Municipal.NAMOBUDDHA_MUNICIPALITY,
                    Municipal.PANCHKHAL_MUNICIPALITY
                ]
            },
            {
                name: District.LALITPUR,
                municipals: [
                    Municipal.BAGMATI_RURAL_MUNICIPALITY,
                    Municipal.MAHANKAL_RURAL_MUNICIPALITY,
                    Municipal.KONJYOSOM_RURAL_MUNICIPALITY,
                    Municipal.LALITPUR_METROPOLITAN_CITY,
                    Municipal.MAHALAXMI_MUNICIPALITY,
                    Municipal.GODAWARI_MUNICIPALITY
                ]
            },
            {
                name: District.NUWAKOT,
                municipals: [
                    Municipal.KAKANI_RURAL_MUNICIPALITY,
                    Municipal.TADI_RURAL_MUNICIPALITY,
                    Municipal.LIKHU_RURAL_MUNICIPALITY,
                    Municipal.MYAGANG_RURAL_MUNICIPALITY,
                    Municipal.SHIVAPURI_RURAL_MUNICIPALITY,
                    Municipal.KISPANG_RURAL_MUNICIPALITY,
                    Municipal.SURYAGADHI_RURAL_MUNICIPALITY,
                    Municipal.TARKESHWAR_RURAL_MUNICIPALITY,
                    Municipal.PANCHAKANYA_RURAL_MUNICIPALITY,
                    Municipal.DUPCHESHWAR_RURAL_MUNICIPALITY,
                    Municipal.BELKOTGADHI_MUNICIPALITY,
                    Municipal.BIDUR_MUNICIPALITY
                ]
            },
            {
                name: District.RASUWA,
                municipals: [
                    Municipal.KALIKA_RURAL_MUNICIPALITY,
                    Municipal.NAUKUNDA_RURAL_MUNICIPALITY,
                    Municipal.UTTARGAYA_RURAL_MUNICIPALITY,
                    Municipal.GOSAIKUNDA_RURAL_MUNICIPALITY,
                    Municipal.AMACHODINGMO_RURAL_MUNICIPALITY
                ]
            },
            {
                name: District.SINDHUPALCHOK,
                municipals: [
                    Municipal.JUGAL_RURAL_MUNICIPALITY,
                    Municipal.BALEFI_RURAL_MUNICIPALITY,
                    Municipal.HELAMBU_RURAL_MUNICIPALITY,
                    Municipal.BHOTEKOSHI_RURAL_MUNICIPALITY,
                    Municipal.LISANGKHU_PAKHAR_RURAL_MUNICIPALITY,
                    Municipal.INDRAWATI_RURAL_MUNICIPALITY,
                    Municipal.TRIPURASUNDARI_RURAL_MUNICIPALITY,
                    Municipal.PANCHPOKHARI_THANGPAL_RURAL_MUNICIPALITY,
                    Municipal.CHAUTARA_SANGACHOKGADHI_MUNICIPALITY,
                    Municipal.BARHABISE_MUNICIPALITY,
                    Municipal.MELAMCHI_MUNICIPALITY
                ]
            },
            {
                name: District.CHITWAN,
                municipals: [
                    Municipal.BHARATPUR_METROPOLITAN_CITY,
                    Municipal.KALIKA_MUNICIPALITY,
                    Municipal.KHAIRAHANI_MUNICIPALITY,
                    Municipal.RATNANAGAR_MUNICIPALITY,
                    Municipal.RAPTI_MUNICIPALITY,
                    Municipal.ICHCHHAKAMANA_RURAL_MUNICIPALITY,
                ]
            },
            {
                name: District.MAKWANPUR,
                municipals: [
                    Municipal.HETAUDA_SUB_METROPOLITAN_CITY,
                    Municipal.THAHA_MUNICIPALITY,
                    Municipal.BHIMPHEDI_RURAL_MUNICIPALITY,
                    Municipal.MAKAWANPURGADHI_RURAL_MUNICIPALITY,
                    Municipal.MANAHARI_RURAL_MUNICIPALITY,
                    Municipal.RAKSIRANG_RURAL_MUNICIPALITY,
                    Municipal.BAKAIYA_RURAL_MUNICIPALITY,
                    Municipal.BAGMATI_RURAL_MUNICIPALITY,
                    Municipal.KAILASH_RURAL_MUNICIPALITY,
                    Municipal.INDRASAROWAR_RURAL_MUNICIPALITY
                ]
            }
        ]
    },
    {
        province: Province.GANDAKI,
        districts: [
            {
                name: District.BAGLUNG,
                municipals: [
                    Municipal.BARENG_RURAL_MUNICIPALITY,
                    Municipal.BADIGAD_RURAL_MUNICIPALITY,
                    Municipal.NISIKHOLA_RURAL_MUNICIPALITY,
                    Municipal.KANTHEKHOLA_RURAL_MUNICIPALITY,
                    Municipal.TARA_KHOLA_RURAL_MUNICIPALITY,
                    Municipal.TAMAN_KHOLA_RURAL_MUNICIPALITY,
                    Municipal.JAIMUNI_MUNICIPALITY,
                    Municipal.BAGLUNG_MUNICIPALITY,
                    Municipal.GALKOT_MUNICIPALITY,
                    Municipal.DHORPATAN_MUNICIPALITY
                ]
            },
            {
                name: District.GORKHA,
                municipals: [
                    Municipal.GANDAKI_RURAL_MUNICIPALITY,
                    Municipal.DHARCHE_RURAL_MUNICIPALITY,
                    Municipal.AARUGHAT_RURAL_MUNICIPALITY,
                    Municipal.AJIRKOT_RURAL_MUNICIPALITY,
                    Municipal.SAHID_LAKHAN_RURAL_MUNICIPALITY,
                    Municipal.SIRANCHOK_RURAL_MUNICIPALITY,
                    Municipal.BHIMSENTHAPA_RURAL_MUNICIPALITY,
                    Municipal.CHUM_NUBRI_RURAL_MUNICIPALITY,
                    Municipal.BARPAK_SULIKOT_RURAL_MUNICIPALITY,
                    Municipal.PALUNGTAR_MUNICIPALITY,
                    Municipal.GORKHA_MUNICIPALITY
                ]
            },
            {
                name: District.KASKI,
                municipals: [
                    Municipal.RUPA_RURAL_MUNICIPALITY,
                    Municipal.MADI_RURAL_MUNICIPALITY,
                    Municipal.ANNAPURNA_RURAL_MUNICIPALITY,
                    Municipal.MACHHAPUCHCHHRE_RURAL_MUNICIPALITY,
                    Municipal.POKHARA_METROPOLITIAN_CITY
                ]
            },
            {
                name: District.LAMJUNG,
                municipals: [
                    Municipal.DORDI_RURAL_MUNICIPALITY,
                    Municipal.DUDHPOKHARI_RURAL_MUNICIPALITY,
                    Municipal.MARSYANGDI_RURAL_MUNICIPALITY,
                    Municipal.KWHOLASOTHAR_RURAL_MUNICIPALITY,
                    Municipal.SUNDARBAZAR_MUNICIPALITY,
                    Municipal.BESISHAHAR_MUNICIPALITY,
                    Municipal.RAINAS_MUNICIPALITY,
                    Municipal.MADHYANEPAL_MUNICIPALITY
                ]
            },
            {
                name: District.MANANG,
                municipals: [
                    Municipal.CHAME_RURAL_MUNICIPALITY,
                    Municipal.NARSHON_RURAL_MUNICIPALITY,
                    Municipal.NARPA_BHUMI_RURAL_MUNICIPALITY,
                    Municipal.MANANG_INGSHYANG_RURAL_MUNICIPALITY
                ]
            },
            {
                name: District.MUSTANG,
                municipals: [
                    Municipal.THASANG_RURAL_MUNICIPALITY,
                    Municipal.GHARAPJHONG_RURAL_MUNICIPALITY,
                    Municipal.LOMANTHANG_RURAL_MUNICIPALITY,
                    Municipal.LO_GHEKAR_DAMODARKUNDA_RURAL_MUNICIPALITY,
                    Municipal.WARAGUNG_MUKTIKHSETRA_RURAL_MUNICIPALITY
                ]
            },
            {
                name: District.MYAGDI,
                municipals: [
                    Municipal.MANGALA_RURAL_MUNICIPALITY,
                    Municipal.RAGHUGANGA_RURAL_MUNICIPALITY,
                    Municipal.DHAULAGIRI_RURAL_MUNICIPALITY,
                    Municipal.BENI_MUNICIPALITY
                ]
            },
            {
                name: District.NAWALPUR,
                municipals: [
                    Municipal.BAUDEEKALI_RURAL_MUNICIPALITY,
                    Municipal.BULINGTAR_RURAL_MUNICIPALITY,
                    Municipal.HUPSEKOT_RURAL_MUNICIPALITY,
                    Municipal.BINAYEE_TRIBENI_RURAL_MUNICIPALITY,
                    Municipal.MADHYABINDU_MUNICIPALITY,
                    Municipal.DEVCHULI_MUNICIPALITY,
                    Municipal.GAIDAKOT_MUNICIPALITY,
                    Municipal.KAWASOTI_MUNICIPALITY
                ]
            },
            {
                name: District.PARBAT,
                municipals: [
                    Municipal.MODI_RURAL_MUNICIPALITY,
                    Municipal.PAINYU_RURAL_MUNICIPALITY,
                    Municipal.JALJALA_RURAL_MUNICIPALITY,
                    Municipal.BIHADI_RURAL_MUNICIPALITY,
                    Municipal.MAHASHILA_RURAL_MUNICIPALITY,
                    Municipal.KUSHMA_MUNICIPALITY,
                    Municipal.PHALEBAS_MUNICIPALITY
                ]
            },
            {
                name: District.SYANGJA,
                municipals: [
                    Municipal.HARINAS_RURAL_MUNICIPALITY,
                    Municipal.BIRUWA_RURAL_MUNICIPALITY,
                    Municipal.AANDHIKHOLA_RURAL_MUNICIPALITY,
                    Municipal.PHEDIKHOLA_RURAL_MUNICIPALITY,
                    Municipal.ARJUNCHAUPARI_RURAL_MUNICIPALITY,
                    Municipal.PUTALIBAZAR_MUNICIPALITY,
                    Municipal.BHIRKOT_MUNICIPALITY,
                    Municipal.GALYANG_MUNICIPALITY,
                    Municipal.CHAPAKOT_MUNICIPALITY,
                    Municipal.WALING_MUNICIPALITY
                ]
            },
            {
                name: District.TANAHUN,
                municipals: [
                    Municipal.GHIRING_RURAL_MUNICIPALITY,
                    Municipal.DEVGHAT_RURAL_MUNICIPALITY,
                    Municipal.RHISHING_RURAL_MUNICIPALITY,
                    Municipal.MYAGDE_RURAL_MUNICIPALITY,
                    Municipal.BANDIPUR_RURAL_MUNICIPALITY,
                    Municipal.ANBUKHAIRENI_RURAL_MUNICIPALITY,
                    Municipal.BYAS_MUNICIPALITY,
                    Municipal.SHUKLAGANDAKI_MUNICIPALITY,
                    Municipal.BHIMAD_MUNICIPALITY,
                    Municipal.BHANU_MUNICIPALITY
                ]
            }
        ]
    },
    {
        province: Province.LUMBINI,
        districts: [
            {
                name: District.KAPILVASTU,
                municipals: [
                    Municipal.YASHODHARA_RURAL_MUNICIPALITY,
                    Municipal.BIJAYANAGAR_RURAL_MUNICIPALITY,
                    Municipal.MAYADEVI_RURAL_MUNICIPALITY,
                    Municipal.SUDDHODHAN_RURAL_MUNICIPALITY,
                    Municipal.SHIVARAJ_MUNICIPALITY,
                    Municipal.KAPILBASTU_MUNICIPALITY,
                    Municipal.BUDDHABHUMI_MUNICIPALITY,
                    Municipal.MAHARAJGUNJ_MUNICIPALITY,
                    Municipal.BANGANGA_MUNICIPALITY,
                    Municipal.KRISHNANAGAR_MUNICIPALITY
                ]
            },
            {
                name: District.PARASI,
                municipals: [
                    Municipal.SARAWAL_RURAL_MUNICIPALITY,
                    Municipal.SUSTA_RURAL_MUNICIPALITY,
                    Municipal.PRATAPPUR_RURAL_MUNICIPALITY,
                    Municipal.PALHI_NANDAN_RURAL_MUNICIPALITY,
                    Municipal.BARDAGHAT_MUNICIPALITY,
                    Municipal.SUNWAL_MUNICIPALITY,
                    Municipal.RAMGRAM_MUNICIPALITY
                ]
            },
            {
                name: District.RUPANDEHI,
                municipals: [
                    Municipal.KANCHAN_RURAL_MUNICIPALITY,
                    Municipal.SIYARI_RURAL_MUNICIPALITY,
                    Municipal.ROHINI_RURAL_MUNICIPALITY,
                    Municipal.GAIDAHAWA_RURAL_MUNICIPALITY,
                    Municipal.OMSATIYA_RURAL_MUNICIPALITY,
                    Municipal.SUDDHDHODHAN_RURAL_MUNICIPALITY,
                    Municipal.MAYADEVI_RURAL_MUNICIPALITY_2,
                    Municipal.MARCHAWARI_RURAL_MUNICIPALITY,
                    Municipal.KOTAHIMAI_RURAL_MUNICIPALITY,
                    Municipal.SAMMARIMAI_RURAL_MUNICIPALITY,
                    Municipal.BUTWAL_SUB_METROPOLITAN_CITY,
                    Municipal.LUMBINI_SANSKRITIK_MUNICIPALITY,
                    Municipal.DEVDAHA_MUNICIPALITY,
                    Municipal.SAINAMAINA_MUNICIPALITY,
                    Municipal.SIDDHARTHANAGAR_MUNICIPALITY,
                    Municipal.TILLOTAMA_MUNICIPALITY
                ]
            },
            {
                name: District.ARGHAKHANCHI,
                municipals: [
                    Municipal.PANINI_RURAL_MUNICIPALITY,
                    Municipal.CHHATRADEV_RURAL_MUNICIPALITY,
                    Municipal.MALARANI_RURAL_MUNICIPALITY,
                    Municipal.BHUMEKASTHAN_MUNICIPALITY,
                    Municipal.SITGANGA_MUNICIPALITY,
                    Municipal.SANDHIKHARKA_MUNICIPALITY
                ]
            },
            {
                name: District.GULMI,
                municipals: [
                    Municipal.RURU_RURAL_MUNICIPALITY,
                    Municipal.ISMA_RURAL_MUNICIPALITY,
                    Municipal.MADANE_RURAL_MUNICIPALITY,
                    Municipal.MALIKA_RURAL_MUNICIPALITY,
                    Municipal.CHATRAKOT_RURAL_MUNICIPALITY,
                    Municipal.DHURKOT_RURAL_MUNICIPALITY,
                    Municipal.SATYAWATI_RURAL_MUNICIPALITY,
                    Municipal.CHANDRAKOT_RURAL_MUNICIPALITY,
                    Municipal.KALIGANDAKI_RURAL_MUNICIPALITY,
                    Municipal.GULMI_DARBAR_RURAL_MUNICIPALITY,
                    Municipal.RESUNGA_MUNICIPALITY,
                    Municipal.MUSIKOT_MUNICIPALITY
                ]
            },
            {
                name: District.PALPA,
                municipals: [
                    Municipal.RAMBHA_RURAL_MUNICIPALITY,
                    Municipal.TINAU_RURAL_MUNICIPALITY,
                    Municipal.NISDI_RURAL_MUNICIPALITY,
                    Municipal.MATHAGADHI_RURAL_MUNICIPALITY,
                    Municipal.RIBDIKOT_RURAL_MUNICIPALITY,
                    Municipal.PURBAKHOLA_RURAL_MUNICIPALITY,
                    Municipal.BAGNASKALI_RURAL_MUNICIPALITY,
                    Municipal.RAINADEVI_CHHARA_RURAL_MUNICIPALITY,
                    Municipal.TANSEN_MUNICIPALITY,
                    Municipal.RAMPUR_MUNICIPALITY
                ]
            },
            {
                name: District.DANG,
                municipals: [
                    Municipal.BABAI_RURAL_MUNICIPALITY,
                    Municipal.GADHAWA_RURAL_MUNICIPALITY,
                    Municipal.RAPTI_RURAL_MUNICIPALITY,
                    Municipal.RAJPUR_RURAL_MUNICIPALITY,
                    Municipal.DANGISHARAN_RURAL_MUNICIPALITY,
                    Municipal.SHANTINAGAR_RURAL_MUNICIPALITY,
                    Municipal.BANGLACHULI_RURAL_MUNICIPALITY,
                    Municipal.TULSIPUR_SUB_METROPOLITAN_CITY,
                    Municipal.GHORAHI_SUB_METROPOLITAN_CITY,
                    Municipal.LAMAHI_MUNICIPALITY
                ]
            },
            {
                name: District.PYUTHAN,
                municipals: [
                    Municipal.AYIRABATI_RURAL_MUNICIPALITY,
                    Municipal.GAUMUKHI_RURAL_MUNICIPALITY,
                    Municipal.JHIMRUK_RURAL_MUNICIPALITY,
                    Municipal.NAUBAHINI_RURAL_MUNICIPALITY,
                    Municipal.MANDAVI_RURAL_MUNICIPALITY,
                    Municipal.MALLARANI_RURAL_MUNICIPALITY,
                    Municipal.SARUMARANI_RURAL_MUNICIPALITY,
                    Municipal.PYUTHAN_MUNICIPALITY,
                    Municipal.SWORGADWARY_MUNICIPALITY
                ]
            },
            {
                name: District.ROLPA,
                municipals: [
                    Municipal.THAWANG_RURAL_MUNICIPALITY,
                    Municipal.SUNCHHAHARI_RURAL_MUNICIPALITY,
                    Municipal.LUNGRI_RURAL_MUNICIPALITY,
                    Municipal.GANGADEVA_RURAL_MUNICIPALITY,
                    Municipal.TRIBENI_RURAL_MUNICIPALITY,
                    Municipal.PARIWARTAN_RURAL_MUNICIPALITY,
                    Municipal.RUNTIGADI_RURAL_MUNICIPALITY,
                    Municipal.SUNIL_SMRITI_RURAL_MUNICIPALITY,
                    Municipal.ROLPA_MUNICIPALITY
                ]
            },
            {
                name: District.EASTERN_RUKUM,
                municipals: [
                    Municipal.BHUME_RURAL_MUNICIPALITY,
                    Municipal.SISNE_RURAL_MUNICIPALITY,
                    Municipal.PUTHA_UTTARGANGA_RURAL_MUNICIPALITY
                ]
            },
            {
                name: District.BANKE,
                municipals: [
                    Municipal.KHAJURA_RURAL_MUNICIPALITY,
                    Municipal.JANKI_RURAL_MUNICIPALITY,
                    Municipal.BAIJNATH_RURAL_MUNICIPALITY,
                    Municipal.DUDUWA_RURAL_MUNICIPALITY,
                    Municipal.NARAINAPUR_RURAL_MUNICIPALITY,
                    Municipal.RAPTI_SONARI_RURAL_MUNICIPALITY,
                    Municipal.KOHALPUR_MUNICIPALITY,
                    Municipal.NEPALGUNJ_SUB_METROPOLITAN_CITY
                ]
            },
            {
                name: District.BARDIYA,
                municipals: [
                    Municipal.GERUWA_RURAL_MUNICIPALITY,
                    Municipal.BADHAIYATAL_RURAL_MUNICIPALITY,
                    Municipal.THAKURBABA_MUNICIPALITY,
                    Municipal.BANSAGADHI_MUNICIPALITY,
                    Municipal.BARBARDIYA_MUNICIPALITY,
                    Municipal.RAJAPUR_MUNICIPALITY,
                    Municipal.MADHUWAN_MUNICIPALITY,
                    Municipal.GULARIYA_MUNICIPALITY
                ]
            }
        ]
    }
    


]