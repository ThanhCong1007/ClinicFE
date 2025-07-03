
// Price data
export type PriceItemType = {
    type: string;
    name: string;
    warranty: string;
    price: string;
    image: string;
  };
export const priceData : PriceItemType[] = [
    {
        type: "Răng sứ kim loại",
        name: "Ceramco 3 - Mỹ",
        warranty: "Bảo hành 3 năm",
        price: "1.000.000 VND",
        image: "/img/gia-boc-rang-su-1.png"
    },
    {
        type: "Răng sứ kim loại",
        name: "Chrom-Cobalt - Mỹ",
        warranty: "Bảo hành 5 năm",
        price: "3.500.000 VND",
        image: "/img/gia-boc-rang-su-2.png"
    },
    {
        type: "Răng sứ toàn sứ Đức",
        name: "Bio Esthetic",
        warranty: "Bảo hành 10 năm",
        price: "4.500.000 VND",
        image: "/img/gia-boc-rang-su-3.png"
    },
    {
        type: "Răng sứ toàn sứ Đức",
        name: "Multilayer DDBio",
        warranty: "Bảo hành 10 năm",
        price: "5.500.000 VND",
        image: "/img/gia-boc-rang-su-4.png"
    },
    {
        type: "Răng sứ toàn sứ Đức",
        name: "Multilayer Cercon HT",
        warranty: "Bảo hành 10 năm",
        price: "6.500.000 VND",
        image: "/img/gia-boc-rang-su-5.png"
    },
    {
        type: "Răng sứ toàn sứ Đức",
        name: "Lava Plus",
        warranty: "Bảo hành 15 năm",
        price: "8.000.000 VND",
        image: "/img/gia-boc-rang-su-6.png"
    },
    {
        type: "Răng sứ toàn sứ Đức",
        name: "Nacera 9 Max",
        warranty: "Bảo hành 15 năm",
        price: "9.000.000 VND",
        image: "/img/gia-boc-rang-su-7.png"
    },
    {
        type: "Răng sứ toàn sứ Đức",
        name: "Lava Esthetic",
        warranty: "Bảo hành 20 năm",
        price: "1.400.000 VND",
        image: "/img/gia-boc-rang-su-8.png"
    }
];

// Indications data
export const indicationsData = [
    {
        image: "/img/boc-rang-su-3.png",
        text: "Răng bị sâu, sứt mẻ, gãy vỡ, viêm tủy, mòn men răng"
    },
    {
        image: "/img/boc-rang-su-5.png",
        text: "Răng thưa hở, răng mọc lệch lạc, khấp khểnh, răng hô, móm"
    },
    {
        image: "/img/boc-rang-su-6.png",
        text: "Răng bị xỉn màu, nhiễm kháng sinh tetracylin, ngả vàng, không thể tẩy trắng được"
    },
    {
        image: "/img/boc-rang-su-7.png",
        text: "Răng hư, có hình dạng to, nhỏ không đồng đều"
    }
];

export const fixedTeethPrices = [
    { name: "Răng sứ kim loại (Ceramco 3 - Mỹ)", price: "1.000.000", warranty: "3 năm" },
    { name: "Răng sứ kim loại (Chrom-Cobalt - Mỹ)", price: "3.500.000", warranty: "5 năm" },
    { name: "Răng sứ toàn sứ Đức (Bio Esthetic)", price: "4.500.000", warranty: "10 năm" },
    { name: "Răng sứ toàn sứ Đức (Multilayer DDBio)", price: "5.500.000", warranty: "10 năm" },
    { name: "Răng sứ toàn sứ Đức (Multilayer Cercon HT)", price: "6.500.000", warranty: "10 năm" },
    { name: "Răng sứ toàn sứ Đức (Lava Plus)", price: "8.000.000", warranty: "15 năm" },
    { name: "Răng sứ toàn sứ Đức (Nacera 9 Max)", price: "9.000.000", warranty: "15 năm" },
    { name: "Răng sứ toàn sứ Đức (Lava Esthetic)", price: "1.400.000", warranty: "20 năm" },
    { name: "Veneer Emax CAD (Ivoclar – Đức)", price: "6.000.000", warranty: "5 năm" },
    { name: "Veneer Emax Press (Ivoclar – Đức)", price: "8.000.000", warranty: "5 năm" },
    { name: "Veneer Lisi Press (GC – Mỹ)", price: "10.000.000", warranty: "5 năm" },
    { name: "Veneer Lisi Press Ultra Thin (GC – Mỹ)", price: "12.000.000", warranty: "5 năm" },
    { name: "Thẩm mỹ răng sứ toàn hàm", price: "Giảm 30% cho cho tất cả loại răng toàn sứ", warranty: "" },
];

export const removableTeethPrices = [
    { name: "Răng nhựa Việt Nam", price: "300.000", warranty: "" },
    { name: "Răng nhựa Justi (Mỹ)", price: "600.000", warranty: "" },
    { name: "Răng Composite (Nhật)", price: "800.000", warranty: "" },
    { name: "Răng nhựa Vita (Đức)", price: "1.000.000", warranty: "" },
    { name: "Răng sứ tháo lắp", price: "1.000.000", warranty: "" },
    { name: "Hàm khung", price: "1.500.000", warranty: "(Không kể răng)", isJaw: true },
    { name: "Hàm Bisoft", price: "4.000.000", warranty: "(Không kể răng)", isJaw: true },
    { name: "Hàm khung liên kết", price: "10.000.000", warranty: "(Kể cả răng)", isJaw: true },
];

export const coreOptions = [
    { name: "Trám tái tạo cùi", price: "300.000", warranty: "" },
    { name: "Cùi kim loại/ Chốt kim loại", price: "300.000", warranty: "" },
    { name: "Chốt sợi", price: "1.000.000", warranty: "" },
    { name: "Cùi sứ Zirconia", price: "2.000.000", warranty: "" },
];
