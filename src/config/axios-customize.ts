import axiosClient from "axios";


/**
 * Creates an initial 'axios' instance with custom settings.
 */

const instance = axiosClient.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials: true  // cho phép gửi và nhận cookie
});

const NO_RETRY_HEADER = 'x-no-retry';


// lấy ra refresh token 
const handleRefreshToken = async () => {
    const res = await instance.get('/api/v1/auth/refresh');
    if (res && res.data) return res.data.access_token;
    else return null;
}

/* intercepters: là một cơ chế cho phép bạn can thiệp vào quá trình xử lý request hoặc response
   trước khi chúng được xử lý bởi then hoặc catch.
   Tác dụng chính của interceptor này:

    Tự động xác thực: Thêm token vào mọi request mà không cần code lặp lại.
    Chuẩn hóa headers: Đảm bảo mọi request đều có các headers cần thiết.
    Tăng tính bảo mật: Token được lấy từ localStorage, không cần lưu trữ trong code.
    Giảm lặp code: Không cần thêm headers này vào mỗi request riêng lẻ.
*/

instance.interceptors.request.use(function (config) {
    // windown: có ở trong môi trường browers
    if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    // nếu chưa có thì thêm vào headers

    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";        // yêu cầu server trả về JSON 
        config.headers["Content-Type"] = "application/json; charset=utf-8"; // định dạng JSON và utf-8
    }
    return config;
});


instance.interceptors.response.use(
    (res) => res.data,  
    async (error) => {
        if (error.config && error.response
            && +error.response.status === 401
            && !error.config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            error.config.headers[NO_RETRY_HEADER] = 'true'  // Đánh dấu request đã được thử refresh để tránh lặp vô hạn.
            if (access_token) {
                error.config.headers['Authorization'] = `Bearer ${access_token}`;
                localStorage.setItem('access_token', access_token)
                return instance.request(error.config);
            }
        }

        if (
            error.config && error.response
            && +error.response.status === 400
            && error.config.url === '/api/v1/auth/refresh'
        ) {
            localStorage.removeItem('access_token')
            alert(`You don't have permission to visit this page. OK ?`);
            window.location.href = "/";
        }

        return error?.response?.data ?? Promise.reject(error);  // nếu có lỗi từ server thì trả k thì trả về message
    }
);


export default instance;
