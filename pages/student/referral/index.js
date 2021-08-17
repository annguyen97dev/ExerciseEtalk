import React, { useRef, useEffect, useState } from 'react';
import { getStudentLayout } from '~/components/Layout';
import './index.module.scss';
const Referral = () => {
	const [url, setUrl] = useState('');
	const [isCopy, setIsCopy] = useState(false);
	const refInput = useRef(true);
	const copy = (element) => {
		return () => {
			document.execCommand('copy', false, element.select());
			setIsCopy(true);
			setTimeout(() => {
				setIsCopy(false);
			}, 3000);
		};
	};

	const copyShareUrl = copy(refInput.current);

	useEffect(() => {
		setUrl('https://etalk.vn/student/referral/code=325454');
		return () => {
			refInput.current && (refInput.current = false);
		};
	}, []);

	return (
		<>
			<h1 className="main-title-page">Referral</h1>
			<div className="card">
				<div className="card-body">
					<div className="row">
						<div className="col-12">
							<div className="mg-b-30">
								<h2>“THÊM BẠN- THÊM VUI”</h2>
								<p>
									E-talk khuyến khích học viên giới thiệu bạn bè đến cùng học
									tại E-talk.vn, để nhận được điểm thưởng dưới dạng{' '}
									<strong>voucher - ưu đãi học phí cho cả 2 bạn.</strong>
								</p>
							</div>
							<div className="tx-center mg-b-30">
								<h4 className="tx-primary mg-b-15">
									Link invite của bạn (bấm vào ô để sao chép):
								</h4>

								<div className="form-group mg-x-auto" style={{ maxWidth: 600 }}>
									<input
										onClick={copyShareUrl}
										ref={refInput}
										className="shareUrl-input js-shareUrl form-control tx-center bg-secondary bd-secondary"
										type="text"
										readonly="readonly"
										value={url}
									/>
								</div>
								{isCopy ? (
									<p className="tx-success mg-t-15">Sao chép thành công !</p>
								) : (
									''
								)}
							</div>
						</div>
						<div className="col-md-6">
							<h5>Các thức tham gia</h5>
							<ul>
								<li>
									Mỗi học viên E-talk đều có 1 link chia sẻ với Code riêng biệt.
								</li>
								<li>
									Bạn hãy dùng link này để giới thiệu/ chia sẻ E-talk với người
									thân/ bạn bè qua Mail/ Facebook hoặc các công cụ khác
								</li>
								<li>
									Khi bạn bè/ người thân của bạn dùng link này để vào E-talk và
									đăng kí thành công khóa học (trở thành Học viên mới của
									E-talk), cả 2 bạn sẽ được nhận ngay:
								</li>
								<li style={{ listStyle: 'none' }}>
									<ul>
										<li>
											Học viên mới (người được giới thiệu): nhận ưu đãi 100,000
											vnđ, áp dụng ngay cho khóa học vừa đăng ký
										</li>
										<li>
											Học viên cũ (người giới thiệu): nhận điểm thưởng 100,000
											vnđ, áp dụng giảm trừ vào học phí cho tất cả khóa học tại
											E-talk
										</li>
									</ul>
								</li>
								<li>
									Phần thưởng có thể được cộng dồn. Ví dụ : Giới thiệu thành
									công 5 người, khóa học tiếp theo bạn được giảm 500.000 đ.
								</li>
							</ul>
						</div>
						<div className="col-md-6">
							<h5>Điều kiện & điều khoản</h5>
							<ul>
								<li>Người tham gia giới thiệu phải là học viên tại E-Talk</li>
								<li>Người được giới thiệu phải hoàn toàn mới tại E-Talk.</li>
								<li>
									Link dùng để giới thiệu/ chia sẻ: [Mypage.e-talk.vn --> Giới
									thiệu bạn --> Nội dung]
								</li>
								<li>
									Số lượng giới thiệu không giới hạn. Giới thiệu được xem là
									thành công khi người được giới thiệu hoàn thành học phí và thủ
									tục nhập học
								</li>
								<li>
									Học viên được giới thiệu bởi nhiều người thì chỉ được tính cho
									người giới thiệu cuối cùng (VD: Học viên A được giới thiệu bởi
									B và C thì link được A click vào cuối cùng của ai sẽ được tính
									ưu đãi cho người đó)
								</li>
								<li>
									Chỉ áp dụng giảm trừ học phí cho khóa học tại E-talk, không có
									giá trị quy đổi thành tiền hay chuyển nhượng.
								</li>
								<li>Điều kiện và điều khoản chung được áp dụng.</li>
							</ul>
						</div>
						<div className="col-12 mg-t-30">
							<h5 className="mg-b-15">Danh sách đã mời</h5>
							<div className="table-responsive ">
								<table className="table">
									<thead>
										<tr>
											<th>STT</th>
											<th>Tài khoản được mời</th>
											<th>Ngày tham gia</th>
											<th>Điểm thưởng</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nguyễn Yến Nhi</td>
											<td>20/04/2020</td>
											<td>100.000</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Nguyễn Yến Nhi</td>
											<td>20/04/2020</td>
											<td>100.000</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Nguyễn Yến Nhi</td>
											<td>20/04/2020</td>
											<td>100.000</td>
										</tr>
										<tr>
											<td>4</td>
											<td>Nguyễn Yến Nhi</td>
											<td>20/04/2020</td>
											<td>100.000</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

Referral.getLayout = getStudentLayout;
export default Referral;
