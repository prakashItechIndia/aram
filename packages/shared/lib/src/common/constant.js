// import { ClientReasons } from '../_api';
import { getSelectOptions } from '../lib/helper';
export var ClientStatus;
(function (ClientStatus) {
    ClientStatus["All"] = "All";
    ClientStatus["Active"] = "Active";
    ClientStatus["Inactive"] = "Inactive";
    ClientStatus["Invited"] = "Invited";
    ClientStatus["Deactivated"] = "Deactivated";
})(ClientStatus || (ClientStatus = {}));
export var USStateEnum;
(function (USStateEnum) {
    USStateEnum["Alabama"] = "AL";
    USStateEnum["Alaska"] = "AK";
    USStateEnum["Arizona"] = "AZ";
    USStateEnum["Arkansas"] = "AR";
    USStateEnum["California"] = "CA";
    USStateEnum["Colorado"] = "CO";
    USStateEnum["Connecticut"] = "CT";
    USStateEnum["Delaware"] = "DE";
    USStateEnum["Florida"] = "FL";
    USStateEnum["Georgia"] = "GA";
    USStateEnum["Hawaii"] = "HI";
    USStateEnum["Idaho"] = "ID";
    USStateEnum["Illinois"] = "IL";
    USStateEnum["Indiana"] = "IN";
    USStateEnum["Iowa"] = "IA";
    USStateEnum["Kansas"] = "KS";
    USStateEnum["Kentucky"] = "KY";
    USStateEnum["Louisiana"] = "LA";
    USStateEnum["Maine"] = "ME";
    USStateEnum["Maryland"] = "MD";
    USStateEnum["Massachusetts"] = "MA";
    USStateEnum["Michigan"] = "MI";
    USStateEnum["Minnesota"] = "MN";
    USStateEnum["Mississippi"] = "MS";
    USStateEnum["Missouri"] = "MO";
    USStateEnum["Montana"] = "MT";
    USStateEnum["Nebraska"] = "NE";
    USStateEnum["Nevada"] = "NV";
    USStateEnum["NewHampshire"] = "NH";
    USStateEnum["NewJersey"] = "NJ";
    USStateEnum["NewMexico"] = "NM";
    USStateEnum["NewYork"] = "NY";
    USStateEnum["NorthCarolina"] = "NC";
    USStateEnum["NorthDakota"] = "ND";
    USStateEnum["Ohio"] = "OH";
    USStateEnum["Oklahoma"] = "OK";
    USStateEnum["Oregon"] = "OR";
    USStateEnum["Pennsylvania"] = "PA";
    USStateEnum["RhodeIsland"] = "RI";
    USStateEnum["SouthCarolina"] = "SC";
    USStateEnum["SouthDakota"] = "SD";
    USStateEnum["Tennessee"] = "TN";
    USStateEnum["Texas"] = "TX";
    USStateEnum["Utah"] = "UT";
    USStateEnum["Vermont"] = "VT";
    USStateEnum["Virginia"] = "VA";
    USStateEnum["Washington"] = "WA";
    USStateEnum["WestVirginia"] = "WV";
    USStateEnum["Wisconsin"] = "WI";
    USStateEnum["Wyoming"] = "WY";
})(USStateEnum || (USStateEnum = {}));
export const UsStateToText = {
    [USStateEnum.Alabama]: 'Alabama',
    [USStateEnum.Alaska]: 'Alaska',
    [USStateEnum.Arkansas]: 'Arkansas',
    [USStateEnum.Arizona]: 'Arizona',
    [USStateEnum.California]: 'California',
    [USStateEnum.Colorado]: 'Colorado',
    [USStateEnum.Connecticut]: 'Connecticut',
    [USStateEnum.Delaware]: 'Delaware',
    [USStateEnum.Florida]: 'Florida',
    [USStateEnum.Georgia]: 'Georgia',
    [USStateEnum.Hawaii]: 'Hawaii',
    [USStateEnum.Idaho]: 'Idaho',
    [USStateEnum.Illinois]: 'Illinois',
    [USStateEnum.Indiana]: 'Indiana',
    [USStateEnum.Iowa]: 'Iowa',
    [USStateEnum.Kansas]: 'Kansas',
    [USStateEnum.Kentucky]: 'Kentucky',
    [USStateEnum.Louisiana]: 'Louisiana',
    [USStateEnum.Maine]: 'Maine',
    [USStateEnum.Maryland]: 'Maryland',
    [USStateEnum.Massachusetts]: 'Massachusetts',
    [USStateEnum.Michigan]: 'Michigan',
    [USStateEnum.Minnesota]: 'Minnesota',
    [USStateEnum.Mississippi]: 'Mississippi',
    [USStateEnum.Missouri]: 'Missouri',
    [USStateEnum.Montana]: 'Montana',
    [USStateEnum.Nebraska]: 'Nebraska',
    [USStateEnum.Nevada]: 'Nevada',
    [USStateEnum.NewHampshire]: 'New Hampshire',
    [USStateEnum.NewJersey]: 'New Jersey',
    [USStateEnum.NewMexico]: 'New Mexico',
    [USStateEnum.NewYork]: 'New York',
    [USStateEnum.NorthCarolina]: 'North Carolina',
    [USStateEnum.NorthDakota]: 'North Dakota',
    [USStateEnum.Ohio]: 'Ohio',
    [USStateEnum.Oklahoma]: 'Oklahoma',
    [USStateEnum.Oregon]: 'Oregon',
    [USStateEnum.Pennsylvania]: 'Pennsylvania',
    [USStateEnum.RhodeIsland]: 'Rhode Island',
    [USStateEnum.SouthCarolina]: 'South Carolina',
    [USStateEnum.SouthDakota]: 'South Dakota',
    [USStateEnum.Tennessee]: 'Tennessee',
    [USStateEnum.Texas]: 'Texas',
    [USStateEnum.Utah]: 'Utah',
    [USStateEnum.Vermont]: 'Vermont',
    [USStateEnum.Virginia]: 'Virginia',
    [USStateEnum.Washington]: 'Washington',
    [USStateEnum.WestVirginia]: 'West Virginia',
    [USStateEnum.Wisconsin]: 'Wisconsin',
    [USStateEnum.Wyoming]: 'Wyoming',
};
export const UsStateOptions = getSelectOptions(UsStateToText);
export var ListStatus;
(function (ListStatus) {
    ListStatus["All"] = "All";
    ListStatus["Active"] = "Active";
    ListStatus["Inactive"] = "Inactive";
    ListStatus["Invited"] = "Invited";
})(ListStatus || (ListStatus = {}));
export var TherapistListStatus;
(function (TherapistListStatus) {
    TherapistListStatus["All"] = "All";
    TherapistListStatus["Active"] = "Active";
    TherapistListStatus["Inactive"] = "Inactive";
    TherapistListStatus["Invited"] = "Invited";
    TherapistListStatus["Deactivated"] = "Deactivated";
})(TherapistListStatus || (TherapistListStatus = {}));
// export const ClientReasonToName: Record<ClientReasons, string> = {
//   [ClientReasons.CourtOrdered]: 'Court Ordered',
//   [ClientReasons.Voluntary]: 'Voluntary',
// };
// export const clientReasonOptions = getSelectOptions(ClientReasonToName);
