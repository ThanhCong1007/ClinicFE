import { useState } from 'react';
import './PricingTable.css';
import Appointment from '../../components/Appointment';

function PricingTable() {
	// Tạo data cho các phần lặp lại
	const fixedTeethPrices = [
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

	const removableTeethPrices = [
		{ name: "Răng nhựa Việt Nam", price: "300.000", warranty: "" },
		{ name: "Răng nhựa Justi (Mỹ)", price: "600.000", warranty: "" },
		{ name: "Răng Composite (Nhật)", price: "800.000", warranty: "" },
		{ name: "Răng nhựa Vita (Đức)", price: "1.000.000", warranty: "" },
		{ name: "Răng sứ tháo lắp", price: "1.000.000", warranty: "" },
		{ name: "Hàm khung", price: "1.500.000", warranty: "(Không kể răng)", isJaw: true },
		{ name: "Hàm Bisoft", price: "4.000.000", warranty: "(Không kể răng)", isJaw: true },
		{ name: "Hàm khung liên kết", price: "10.000.000", warranty: "(Kể cả răng)", isJaw: true },
	];

	const coreOptions = [
		{ name: "Trám tái tạo cùi", price: "300.000", warranty: "" },
		{ name: "Cùi kim loại/ Chốt kim loại", price: "300.000", warranty: "" },
		{ name: "Chốt sợi", price: "1.000.000", warranty: "" },
		{ name: "Cùi sứ Zirconia", price: "2.000.000", warranty: "" },
	];

	// Component cho hàng giá
	const PriceRow = ({ item, unit = "VND/Răng" }: { item: any, unit?: string }) => {
		const priceUnit = item.isJaw ? "VND/Hàm" : unit;

		return (
			<div className="row g-2 m-0 px-5">
				<div className="col-lg-5 m-0 px-3 price-title" style={{ border: "1px solid rgb(6, 163, 218)" }}>
					<div className="section-title">
						<p className="text-dark m-0" style={{ fontSize: 20 }}>{item.name}</p>
					</div>
				</div>
				<div className="col-lg-7 m-0 py-3" style={{ border: "1px solid rgb(6, 163, 218)" }}>
					<div className="section-title price-price">
						<p className="text-primary m-0" style={{ fontSize: 20, fontWeight: 700 }}>
							{item.price.includes("Giảm") ? item.price : `${item.price} ${priceUnit}`}
						</p>
						{item.warranty && (
							<p className="text-dark m-0" style={{ fontSize: 20 }}>
								{item.warranty.startsWith("(") ? item.warranty : `(Bảo hành ${item.warranty})`}
							</p>
						)}
					</div>
				</div>
			</div>
		);
	};

	// Component cho tiêu đề section
	const SectionTitle = ({ title, className = "" }: { title: string, className?: string }) => (
		<div className="row g-2 m-0 px-5">
			<div className={`col-lg-12 m-0 py-3 ${className}`} style={{ border: "1px solid rgb(6, 163, 218)" }}>
				<div className="section-title text-center">
					<p className="text-primary m-0" style={{ fontSize: 22, fontWeight: 700 }}>{title}</p>
				</div>
			</div>
		</div>
	);

	// Component cho header của bảng
	const TableHeader = () => (
		<>
			<div className="row g-2 m-0 px-5">
				<div className="col-lg-12 pt-3 pb-5 m-0 px-5 bg-dark">
					<div className="section-title text-center">
						<p className="text-white m-0" style={{ fontSize: 22, fontWeight: 700 }}>
							BẢNG GIÁ BỌC RĂNG SỨ MỚI NHẤT 2024
						</p>
					</div>
				</div>
			</div>
			<div className="row g-2 m-0 px-5">
				<div className="col-lg-6 m-0 py-3 px-5 bg-primary">
					<div className="section-title text-center">
						<p className="text-white m-0" style={{ fontSize: 22, fontWeight: 700 }}>LOẠI RĂNG</p>
					</div>
				</div>
				<div className="col-lg-6 m-0 py-3 px-5 bg-primary">
					<div className="section-title text-center">
						<p className="text-white m-0" style={{ fontSize: 22, fontWeight: 700 }}>CHI PHÍ</p>
					</div>
				</div>
			</div>
		</>
	);

	// Component cho payment step
	const PaymentStep = ({ step, text, image }: { step: number, text: string, image: string }) => (
		<div className="row g-5 ps-5 mb-5">
			<div className="col-lg-3 ps-5 me-5">
				<div className="position-relative ps-5">
					<img className="position-absolut rounded" src={image} alt={`Payment step ${step}`} />
				</div>
			</div>
			<div className="col-lg-7 ps-5 ms-5 payment-step">
				<div className="row ps-5 g-5" style={{ width: "100%" }}>
					<div className="col-lg-12 ps-5" style={{ width: "90%" }}>
						<div className="section-title text-center">
							<h3 className="display-7 text-white py-3 m-0 px-5 bg-dark" style={{ width: "100%" }}>ĐỢT {step}</h3>
							<div className="col-lg-12 m-0 py-3 px-5" style={{ border: "1px solid rgb(9, 30, 62)" }}>
								<div className="section-title text-center">
									<p className="text-dark m-0" style={{ fontSize: 18, fontWeight: 600 }}>{text}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// Component cho contact form


	// Component cho TextSection
	const TextSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
		<div className="section-title px-5 mb-3">
			{title && (
				<h4 className="position-relative d-inline-block text-dark-blue text-uppercase mt-3 display-7 mb-3">
					{title}
				</h4>
			)}
			{children}
		</div>
	);

	return (
		<div className="container-fluid p-0 mt-5 mb-4 wow fadeInUp" data-wow-delay="0.1s" style={{ visibility: "visible", animationDelay: "0.1s" }}>

			<div className="container">
				{/* Pricing info */}
				<div className="row g-5 mb-3 px-5">
					{/* Header */}
					<div className="row g-5 mb-5 px-5">
						<div className="col-lg-12 px-5">
							<div className="section-title text-center px-5">
								<h4 className="position-relative d-inline-block text-dark-blue text-uppercase mt-3 display-7">
									Bảng Giá Bọc Răng Sứ Trọn Gói Mới Nhất Hiện Nay
								</h4>
							</div>
						</div>
					</div>

					{/* Intro section */}
					<div className="row g-5 mb-2 px-5">
						<div className="col-lg-12 px-5">
							<TextSection title="1. Bảng giá bọc răng sứ mới nhất tại Nha khoa I-DENT">
								<p style={{ fontSize: 18 }}>
									Giá bọc răng sứ tại Nha khoa I-DENT dao động từ 1.000.000 – 14.000.000 VNĐ/1 cái.
									Mức giá trên là giá trọn gói, đã bao gồm chi phí khám, tư vấn và chụp phim CT, không phát
									sinh thêm bất kỳ chi phí nào khác.
								</p>
							</TextSection>
						</div>
					</div>

					{/* Price tables */}
					<div className="row g-5 mb-5 px-5">
						<div className="col-lg-12 px-5">
							<TableHeader />
							<SectionTitle title="RĂNG CỐ ĐỊNH" />

							{fixedTeethPrices.map((item, index) => (
								<PriceRow key={`fixed-${index}`} item={item} />
							))}

							<SectionTitle title="RĂNG THÁO LẮP" />

							{removableTeethPrices.map((item, index) => (
								<PriceRow key={`removable-${index}`} item={item} />
							))}

							<SectionTitle title="CÙI GIẢ" />

							{coreOptions.map((item, index) => (
								<PriceRow key={`core-${index}`} item={item} />
							))}
						</div>
					</div>
					<div className="col-lg-12 px-5">
						<TextSection title="2. Các loại răng sứ chính hiện nay">
							<p style={{ fontSize: 18 }}>
								Trường hợp bệnh nhân lắp răng sứ từ 16 cái trở lên sẽ được giảm 30% (nha khoa I-Dent cam kết không phát sinh bất kỳ chi phí nào).
								Ngoài ra, tất cả các dịch vụ thăm khám tổng quát, chụp phim CT và tư vấn là hoàn toàn miễn phí 100%.
							</p>
						</TextSection>

						<div className="section-title mb-3 px-5">
							<div className="bg-light py-3 px-3">
								<p className="m-0 ps-4" style={{ fontSize: 18 }}>
									Ví dụ: Trường hợp Bệnh nhân bọc 16 răng sứ và chọn loại răng sứ toàn sứ Multilayer CERCON HT giá 6.500.000VNĐ/răng
								</p>
								<p className="m-0 ps-4" style={{ fontSize: 18 }}>
									Chi phí trọn gói là: 16 x 6.500.000 = 104.000.000VNĐ, giảm 30% còn 72.800.000VNĐ.
								</p>
							</div>
						</div>

						<TextSection title="3. Bảng giá răng sứ tại Nha khoa I-DENT">
							<p className="mb-3" style={{ fontSize: 18 }}>
								Tại Nha khoa I-DENT, bảng giá răng sứ được áp dụng cho tất cả các phương án điều trị có sử dụng răng sứ như:
								Bọc răng sứ, làm cầu răng sứ và phục hình răng sứ trên Implant.
								Hàng tháng Nha khoa sẽ có nhiều chương trình khuyến mãi bọc răng sứ giảm giá lên đến 20% tùy loại răng sứ.
							</p>
							<p style={{ fontSize: 18 }}>
								Trước khi khách hàng quyết định trồng răng sứ, I-DENT sẽ thăm khám, chụp phim và tư vấn hoàn toàn miễn phí.
								Dựa trên tư vấn của bác sĩ, khách hàng sẽ chọn loại răng sứ và số lượng răng cần bọc để có thể tính được tổng mức phí cần chi trả.
							</p>
						</TextSection>

						{/* Types of porcelain teeth */}
						<TextSection title="2. Các loại răng sứ chính hiện nay">
							<p className="mb-3" style={{ fontSize: 18 }}>
								Hiện nay có 3 loại răng sứ chính đang được sử dụng rộng rãi trên thị trường.
								Giá trồng răng sứ của từng loại sẽ có mức chênh lệch nhất định và có sự khác biệt giữa các nha khoa răng sứ.
							</p>
							<p style={{ fontSize: 18 }}>3 loại răng sứ chính hiện nay là:</p>
						</TextSection>

						<TextSection title="2.1 Răng sứ kim loại">
							<p className="mb-3" style={{ fontSize: 18 }}>
								Răng sứ kim loại có phần khung sườn phía trong được làm bằng kim loại và phủ 1 lớp sứ mỏng bên ngoài.
							</p>
							<ul className="mb-3">
								<li style={{ fontSize: 18 }}>
									Ưu điểm: Chi phí hợp lý, thời gian sử dụng lâu dài, tính thẩm mỹ khá cao và đảm bảo được khả năng ăn nhai tốt.
								</li>
								<li style={{ fontSize: 18 }}>
									Khuyết điểm: Sau một thời gian dài sử dụng, răng sứ kim loại dễ gây đen viền nướu và làm mất thẩm mỹ.
								</li>
							</ul>
							<p className="mb-3" style={{ fontSize: 18 }}>
								Có các loại răng sứ kim loại phổ biến như: Răng sứ Ceramco 3 (Mỹ), răng sứ Titan,…
								Mức giá bọc răng sứ kim loại dao động từ 1.000.000 – 2.5000.000 VNĐ/răng.
							</p>
							<div className="position-relative px-5 pic-box">
								<img className="position-absolut rounded" src="/img/banner-rang-su-1.png" alt="Răng sứ kim loại" />
							</div>
						</TextSection>

						<TextSection title="2.2 Răng sứ không kim loại (Răng toàn sứ)">
							<p className="mb-3" style={{ fontSize: 18 }}>
								Răng sứ toàn sứ được tạo thành từ sứ nguyên khối, với độ trong và cứng chắc hơn so với răng sứ kim loại.
							</p>
							<ul className="mb-3">
								<li style={{ fontSize: 18 }}>
									Ưu điểm: Răng toàn sứ có độ bền và tính thẩm mỹ cao, không gây đen viền nướu sau một thời gian sử dụng và tuổi thọ 1 chiếc răng toàn sứ có thể lên đến 20 năm.
								</li>
								<li style={{ fontSize: 18 }}>
									Khuyết điểm: Chi phí cao hơn so với răng sứ kim loại.
								</li>
							</ul>
							<p className="mb-3" style={{ fontSize: 18 }}>
								Có các loại răng sứ không kim loại phổ biến hiện nay như: Zirconia, DDBio HT, Cercon HT, Nacera PEARL, Nacera 9 MAX,...
							</p>
							<div className="position-relative px-5 py-3 pic-box">
								<img className="position-absolut rounded" src="/img/banner-rang-su-2.png" alt="Răng sứ toàn sứ" />
							</div>
						</TextSection>

						<TextSection title="2.3 Mặt dán sứ">
							<p className="mb-3" style={{ fontSize: 18 }}>
								Mặt dán sứ được xem là phương pháp làm răng sứ thẩm mỹ hiện đại nhất hiện nay.
								Với kỹ thuật này, bác sĩ sẽ sử dụng một lớp sứ mỏng (0,3mm – 0,6mm) dán ở mặt ngoài của
								răng, giúp phục hình thẩm mỹ cho răng thưa, răng xỉn màu ố vàng....
							</p>
							<ul className="mb-3">
								<li style={{ fontSize: 18 }}>
									Ưu điểm: Bảo tồn răng thật tối đa do răng không bị mài quá nhiều. Bên cạnh đó, mặt dán sứ có màu sắc tự nhiên, không gây cộm, cấn khi sử dụng.
								</li>
								<li style={{ fontSize: 18 }}>
									Khuyết điểm: Không giải quyết được các tình trạng răng hô, vẩu, hoặc răng đã bị xô lệch nặng.
								</li>
							</ul>
						</TextSection>

						<TextSection title="3. Phương thức thanh toán khi bọc răng sứ tại Nha khoa I-Dent">
							<p className="mb-3" style={{ fontSize: 18 }}>
								Khi bọc răng sứ tại Nha khoa I-DENT. Cô Chú, Anh Chị sẽ được chia làm 2 đợt thanh toán như sau:
							</p>
							{/* Payment steps */}
							<PaymentStep
								step={1}
								text="Thanh toán vào ngày mài cùi lấy dấu."
								image="/img/banner-rang-su-3.png"
							/>

							<PaymentStep
								step={2}
								text="Thanh toán sau khi thử sứ và hoàn tất quy trình bọc răng sứ."
								image="/img/banner-rang-su-4.png"
							/>

						</TextSection>
					</div>
					<div className="row g-5 mb-5 px-5">
						<div className="section-title px-5 mb-3">
							<div className="py-3 px-4" style={{ border: "2px dashed rgb(0, 88, 153)" }}>
								<p className="mb-3" style={{ fontSize: 18 }}>
									<span style={{ color: "red" }}>Đặc biệt</span>: Nhằm giúp Cô Chú, Anh Chị giảm thiểu gánh nặng tài chính,
									Nha khoa I-DENT có hỗ trợ thanh toán trả góp 0% lãi suất thông qua thẻ tín dụng của hơn
									23 ngân hàng.
								</p>
								<ul>
									<li className="text-dark-blue mb-2" style={{ fontSize: 18, fontWeight: 600 }}>
										Điều kiện: Trả góp với chủ tài khoản sở hữu thẻ tín dụng của các ngân hàng sau:
										Vietcombank, VP Bank, Sacombank, Techcombank, ACB, HSBC…
									</li>
									<li className="text-dark-blue" style={{ fontSize: 18, fontWeight: 600 }}>
										Yêu cầu: Hạn mức thẻ tín dụng trên 20 triệu.
										Quý khách sẽ linh hoạt chi trả trong vòng 3–6–12–24 tháng. Quy trình đơn giản và
										được hướng dẫn cụ thể khi khách hàng đến Nha khoa I-DENT.
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Appointment />
		</div>

	);
}

export default PricingTable;