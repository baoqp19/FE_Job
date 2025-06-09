import { Button, Divider, Form, Input, message, notification, type FormProps } from "antd";
import styles from "./../../styles/auth.module.scss";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { callLogin } from "../../config/api";
import { setUserLoginInfo } from "../../redux/slice/accountSlice";
import { Link, useLocation } from "react-router-dom";

const LoginPage = () => {

	const [isSubmit, setIsSubmit] = useState(false)
	const dispatch = useAppDispatch()

	const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);

	let location = useLocation();


	// useEffect(() => {
	//     if(isAuthenticated){
	//         window.location.href = '/'
	//     }
	// }, [isAuthenticated])

	let params = new URLSearchParams(location.search);
	const callback = params?.get("callback");  // get('callback') = Mycallback


	const onFinish: FormProps['onFinish'] = async (values: any) => {

		const { username, password } = values;
		setIsSubmit(true)

		const res = await callLogin(username, password)
		setIsSubmit(false)

		if (res.data) {
			localStorage.setItem("access_token", res.data.access_token)
			dispatch(setUserLoginInfo(res.data.user))
			message.success('Đăng nhập thành công')
			window.location.href = callback ? callback : "/"
		} else {
			notification.error({
				message: "Có lỗi xẩy ra",
				description:
					res.message && Array.isArray(res.message) ? res.message[0] : res.message,
				duration: 5
			})
		}
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
								<Button type="primary" htmlType="submit" loading={isSubmit}>
									Đăng nhập
								</Button>
							</Form.Item>
							<Divider>Or</Divider>
							<p className={styles['text-normal']}>Bạn chưa có tài khoản ư,
								<span>
									<Link to='/register'> đăng ký</Link>
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
