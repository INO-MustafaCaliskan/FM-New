import {
  FaShip,
  FaPlane,
  FaTrain,
  FaTruck,
} from "react-icons/fa";

export const SHIPPING_MODES = [
  {
    id: 1,
    title: "Sea Freight",
    description: "Transport by Sea",
    icon: FaShip,
  },
  {
    id: 2,
    title: "Air Freight",
    description: "Transport by Air",
    icon: FaPlane,
  },
  {
    id: 3,
    title: "Rail Freight",
    description: "Transport by Rail",
    icon: FaTrain,
  },
  {
    id: 4,
    title: "Land Freight",
    description: "Transport by Land",
    icon: FaTruck,
  },
];

export const DELIVERY_TERMS = [
  {
    id: 1,
    title: "Door to Door",
    description: "Pick Up from a specific address and delivery to a specific address."
  },
  {
    id: 2,
    title: "Port to Port",
    description: "Pick Up from the Port of Loading and delivery to the Port of Destination not include the inland transport."
  },
  {
    id: 3,
    title: "Door to Port",
    description: "Pick up from specific address and transport to Port of Destination."
  },
  {
    id: 4,
    title: "Port to Door",
    description: "Transport from Port of Loading to a specific address."
  }
];


export const SHIPPING_TYPES = {
  1: {
    id: 1,
    name: "Full Container Load",
    shortName: "FCL"
  },

  2: {
    id: 2,
    name: "Less Container Load",
    shortName: "LCL"
  },

  3: {
    id: 3,
    name: "Breakbulk Cargo",
    shortName: "Bulk"
  },

  4: {
    id: 4,
    name: "Standard Cargo",
    shortName: "StandardCargo"
  },

  5: {
    id: 5,
    name: "ULD Container",
    shortName: "ULD"
  },

  6: {
    id: 6,
    name: "Specific Wagon Type",
    shortName: "Wagon"
  },

  7: {
    id: 7,
    name: "Full Truck Load",
    shortName: "FTL"
  },

  8: {
    id: 8,
    name: "Less Truck Load",
    shortName: "LTL"
  }
};

export const SHIPPING_TYPE_MAPPING = {

  // Sea
  1: [1, 2, 3],

  // Air
  2: [5, 4],

  // Rail
  3: [1, 6, 2],

  // Land
  4: [1, 7, 8, 2]

};

export const CONTAINER_TYPES = [
  {
    id: 1,
    title: "20' Standart",
  },
  {
    id: 2,
    title: "40' Standart",
  },
  {
    id: 3,
    title: "40' Hight Cube",
  },
 
];

export const PACKAGE_TYPES = [
  {
    id: 1,
    title: "Box",
  },
  {
    id: 2,
    title: "Pallet",
  },
  {
    id: 3,
    title: "Crate",
  },
  {
    id: 4,
    title: "Bag",
  },
  {
    id: 5,
    title: "Roll",
  },
];

export const TRUCK_TYPES = [
  {
    id: 1,
    title: "Isoterm",
  },
  {
    id: 2,
    title: "Dump",
  },
  {
    id: 3,
    title: "Autocart",
  },
];

export const ULD_CONTAINER_TYPES = [
  {
    id: 1,
    title: "MDP",
  },
  {
    id: 2,
    title: "M-1",
  },
  {
    id: 3,
    title: "HMA stall",
  },
  {
    id: 4,
    title: "Demi",
  },
  {
    id: 5,
    title: "LD-1",
  },
];

export const IMO_CLASSES = [
  {
    id: 1,
    title: "Explosives",
  },
  {
    id: 2,
    title: "Flammable Gases",
  },
  {
    id: 3,
    title: "Non-flammable, Non-poisonous Gases",
  },
  {
    id: 4,
    title: "Poisonous Gases",
  },
  {
    id: 5,
    title: "Flammable Liquids",
  },
  {
    id: 6,
    title: "Flammable Solids",
  },
  {
    id: 7,
    title: "Spontaneously Combustible Solids",
  },
  {
    id: 8,
    title: "Dangerous When Wet",
  },
  {
    id: 9,
    title: "Oxidizing Agent",
  },
  {
    id: 10,
    title: "Organic Peroxides",
  },
  {
    id: 11,
    title: "Toxic, Poison Substances",
  },
  {
    id: 12,
    title: "Biohazard",
  },
  {
    id: 13,
    title: "Radioactives",
  },
  {
    id: 14,
    title: "Corrosives",
  },
  {
    id: 15,
    title: "Miscellaneous",
  },
];

export const CURRENCIES = [
  { code: "AED", title: "United Arab Emirates dirham" },
  { code: "AFN", title: "Afghan afghani" },
  { code: "ALL", title: "Albanian lek" },
  { code: "AMD", title: "Armenian dram" },
  { code: "ANG", title: "Netherlands Antillean guilder" },
  { code: "AOA", title: "Angolan kwanza" },
  { code: "ARS", title: "Argentine peso" },
  { code: "AUD", title: "Australian dollar" },
  { code: "AWG", title: "Aruban florin" },
  { code: "AZN", title: "Azerbaijani manat" },
  { code: "BAM", title: "Bosnia and Herzegovina convertible mark" },
  { code: "BBD", title: "Barbados dollar" },
  { code: "BDT", title: "Bangladeshi taka" },
  { code: "BGN", title: "Bulgarian lev" },
  { code: "BHD", title: "Bahraini dinar" },
  { code: "BIF", title: "Burundian franc" },
  { code: "BMD", title: "Bermudian dollar" },
  { code: "BND", title: "Brunei dollar" },
  { code: "BOB", title: "Boliviano" },
  { code: "BOV", title: "Bolivian Mvdol" },
  { code: "BRL", title: "Brazilian real" },
  { code: "BSD", title: "Bahamian dollar" },
  { code: "BTN", title: "Bhutanese ngultrum" },
  { code: "BWP", title: "Botswana pula" },
  { code: "BYN", title: "Belarusian ruble" },
  { code: "BZD", title: "Belize dollar" },
  { code: "CAD", title: "Canadian dollar" },
  { code: "CDF", title: "Congolese franc" },
  { code: "CHE", title: "WIR euro" },
  { code: "CHF", title: "Swiss franc" },
  { code: "CHW", title: "WIR franc" },
  { code: "CLF", title: "Unidad de Fomento" },
  { code: "CLP", title: "Chilean peso" },
  { code: "COP", title: "Colombian peso" },
  { code: "COU", title: "Unidad de Valor Real" },
  { code: "CRC", title: "Costa Rican colon" },
  { code: "CUC", title: "Cuban convertible peso" },
  { code: "CUP", title: "Cuban peso" },
  { code: "CVE", title: "Cape Verdean escudo" },
  { code: "CZK", title: "Czech koruna" },
  { code: "DJF", title: "Djiboutian franc" },
  { code: "DKK", title: "Danish krone" },
  { code: "DOP", title: "Dominican peso" },
  { code: "DZD", title: "Algerian dinar" },
  { code: "EGP", title: "Egyptian pound" },
  { code: "ERN", title: "Eritrean nakfa" },
  { code: "ETB", title: "Ethiopian birr" },
  { code: "EUR", title: "Euro" },
  { code: "FJD", title: "Fiji dollar" },
  { code: "FKP", title: "Falkland Islands pound" },
  { code: "GBP", title: "Pound sterling" },
  { code: "GEL", title: "Georgian lari" },
  { code: "GHS", title: "Ghanaian cedi" },
  { code: "GIP", title: "Gibraltar pound" },
  { code: "GMD", title: "Gambian dalasi" },
  { code: "GNF", title: "Guinean franc" },
  { code: "GTQ", title: "Guatemalan quetzal" },
  { code: "GYD", title: "Guyanese dollar" },
  { code: "HKD", title: "Hong Kong dollar" },
  { code: "HNL", title: "Honduran lempira" },
  { code: "HRK", title: "Croatian kuna" },
  { code: "HTG", title: "Haitian gourde" },
  { code: "HUF", title: "Hungarian forint" },
  { code: "IDR", title: "Indonesian rupiah" },
  { code: "ILS", title: "Israeli new shekel" },
  { code: "INR", title: "Indian rupee" },
  { code: "IQD", title: "Iraqi dinar" },
  { code: "IRR", title: "Iranian rial" },
  { code: "ISK", title: "Icelandic króna" },
  { code: "JMD", title: "Jamaican dollar" },
  { code: "JOD", title: "Jordanian dinar" },
  { code: "JPY", title: "Japanese yen" },
  { code: "KES", title: "Kenyan shilling" },
  { code: "KGS", title: "Kyrgyzstani som" },
  { code: "KHR", title: "Cambodian riel" },
  { code: "KMF", title: "Comoro franc" },
  { code: "KPW", title: "North Korean won" },
  { code: "KRW", title: "South Korean won" },
  { code: "KWD", title: "Kuwaiti dinar" },
  { code: "KYD", title: "Cayman Islands dollar" },
  { code: "KZT", title: "Kazakhstani tenge" },
  { code: "LAK", title: "Lao kip" },
  { code: "LBP", title: "Lebanese pound" },
  { code: "LKR", title: "Sri Lankan rupee" },
  { code: "LRD", title: "Liberian dollar" },
  { code: "LSL", title: "Lesotho loti" },
  { code: "LYD", title: "Libyan dinar" },
  { code: "MAD", title: "Moroccan dirham" },
  { code: "MDL", title: "Moldovan leu" },
  { code: "MGA", title: "Malagasy ariary" },
  { code: "MKD", title: "Macedonian denar" },
  { code: "MMK", title: "Myanmar kyat" },
  { code: "MNT", title: "Mongolian tögrög" },
  { code: "MOP", title: "Macanese pataca" },
  { code: "MRU", title: "Mauritanian ouguiya" },
  { code: "MUR", title: "Mauritian rupee" },
  { code: "MVR", title: "Maldivian rufiyaa" },
  { code: "MWK", title: "Malawian kwacha" },
  { code: "MXN", title: "Mexican peso" },
  { code: "MYR", title: "Malaysian ringgit" },
  { code: "MZN", title: "Mozambican metical" },
  { code: "NAD", title: "Namibian dollar" },
  { code: "NGN", title: "Nigerian naira" },
  { code: "NIO", title: "Nicaraguan córdoba" },
  { code: "NOK", title: "Norwegian krone" },
  { code: "NPR", title: "Nepalese rupee" },
  { code: "NZD", title: "New Zealand dollar" },
  { code: "OMR", title: "Omani rial" },
  { code: "PAB", title: "Panamanian balboa" },
  { code: "PEN", title: "Peruvian sol" },
  { code: "PGK", title: "Papua New Guinean kina" },
  { code: "PHP", title: "Philippine peso" },
  { code: "PKR", title: "Pakistani rupee" },
  { code: "PLN", title: "Polish złoty" },
  { code: "PYG", title: "Paraguayan guaraní" },
  { code: "QAR", title: "Qatari riyal" },
  { code: "RON", title: "Romanian leu" },
  { code: "RSD", title: "Serbian dinar" },
  { code: "CNY", title: "Renminbi" },
  { code: "RUB", title: "Russian ruble" },
  { code: "TRY", title: "Turkish lira" },
  { code: "USD", title: "United States dollar" },
  { code: "ZAR", title: "South African rand" },
  { code: "ZMW", title: "Zambian kwacha" },
  { code: "ZWL", title: "Zimbabwean dollar" }
];

export const WAGON_TYPES = [
  {
    id: 1,
    title: "Container platform",
  },
  {
    id: 2,
    title: "Closed wagon",
  },
  {
    id: 3,
    title: "Cover",
  },
];

export const TEMPERATURE_TYPES = [
  {
    id: 1,
    title: "°C",
  },
  {
    id: 2,
    title: "°F",
  },
];