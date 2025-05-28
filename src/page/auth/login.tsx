import { Button, Divider, Form, Input, type FormProps } from "antd";
import styles from "./../../styles/auth.module.scss";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const LoginPage = () => {

	const [isSubmit, setIsSubmit] = useState(false)
	const dispatch = useAppDispatch();

	const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);

	const onFinish: FormProps['onFinish'] = (values) => {
		console.log('Success:', values);
	};

	return (
		<div className={styles['login-page']}>
			<main className={styles.main}>
				<div className={styles.container}>
					<section className={styles.wrapper}>
						<div className={styles.heading} >
							<h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng nhập</h2>
							<Divider />
						</div>

						<Form
							name="basic"
							// style={{ maxWidth: 600 }}
							// initialValues={{ remember: true }} //remember tự check
							onFinish={onFinish}
							autoComplete="off"
						>
							<Form.Item
								labelCol={{ span: 24 }}
								label="Email"
								name="username"
								rules={[{ required: true, message: 'Email không được để trống!' }]}
							>
								<Input />
							</Form.Item>

							<Form.Item
								labelCol={{ span: 24 }}
								label="Mật khẩu"
								name="password"
								rules={[{ required: true, message: 'Mật khẩu không được để trôngs !' }]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit" loading>
									Submit
								</Button>
							</Form.Item>
							<Divider>Or</Divider>
							<p>Bạn chưa có tài khoản ư,
								<span>
									{/* <Link> đăng ký</Link> */}
								</span>
							</p>
						</Form>
					</section>
				</div>
			</main>
		</div>
	)
}

export default LoginPage;
