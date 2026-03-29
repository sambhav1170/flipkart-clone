import { useState } from 'react';
import { loginUser, registerUser, requestOtp, verifyOtp } from '../api/api';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isOtpMode) {
        if (!otp) throw new Error("Please enter OTP");
        const res = await verifyOtp(email, otp);
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          onLogin(res.data.user.name, res.data.user.id);
          onClose();
        }
      } else if (isRegister) {
        if (!name || !email || !password) throw new Error("Please fill all required fields");
        const res = await registerUser({ name, email, password, phone });
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          onLogin(res.data.user.name, res.data.user.id);
          onClose();
        }
      } else {
        const res = await loginUser(email, password);
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          onLogin(res.data.user.name, res.data.user.id);
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtpAction = async () => {
    if (!email) return setError("Please enter your Phone or Email first");
    setError('');
    setLoading(true);
    try {
      const res = await requestOtp(email);
      alert(res.message); // Show mock OTP
      setIsOtpMode(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setIsOtpMode(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-sm shadow-2xl flex max-w-[700px] w-full overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
        >
          &times;
        </button>

        {/* Left Side (Blue Banner) */}
        <div className="w-[40%] bg-flipkart-blue p-10 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">{isRegister ? "Looks like you're new here!" : "Login"}</h2>
            <p className="text-[17px] text-gray-200 leading-snug font-medium">
              {isRegister ? "Sign up with your mobile number to get started" : "Get access to your Orders, Wishlist and Recommendations"}
            </p>
          </div>
          <div>
            <img 
              src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png" 
              alt="login-illustration" 
              className="w-full mix-blend-screen opacity-90"
            />
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-[60%] p-10 relative">
          <form onSubmit={handleSubmit} className="flex flex-col h-full mt-4">
            
            {isRegister && !isOtpMode && (
              <div className="mb-6">
                <div className="relative border-b-2 border-gray-300 focus-within:border-flipkart-blue transition duration-200">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegister}
                    placeholder="Enter Full Name"
                    className="w-full py-2 outline-none text-sm peer"
                  />
                </div>
              </div>
            )}

            {!isOtpMode && (
              <div className="mb-6">
                <div className="relative border-b-2 border-gray-300 focus-within:border-flipkart-blue transition duration-200">
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter Email or Phone Number"
                    className="w-full py-2 outline-none text-sm peer"
                  />
                </div>
              </div>
            )}
            
            {isRegister && !isOtpMode && (
              <div className="mb-6">
                <div className="relative border-b-2 border-gray-300 focus-within:border-flipkart-blue transition duration-200">
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter Mobile Number"
                    className="w-full py-2 outline-none text-sm peer"
                  />
                </div>
              </div>
            )}

            {!isOtpMode && (
              <div className="mb-6">
                <div className="relative border-b-2 border-gray-300 focus-within:border-flipkart-blue transition duration-200">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isOtpMode}
                    placeholder="Enter Password"
                    className="w-full py-2 outline-none text-sm peer"
                  />
                </div>
                {!isRegister && <p className="text-xs text-flipkart-blue mt-2 font-semibold cursor-pointer text-right">Forgot?</p>}
              </div>
            )}

            {isOtpMode && (
              <div className="mb-6">
                <div className="relative border-b-2 border-gray-300 focus-within:border-flipkart-blue transition duration-200">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP (Mock: 123456)"
                    className="w-full py-2 outline-none text-sm peer tracking-widest"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-500 font-semibold mb-4">{error}</p>}

            <p className="text-xs text-gray-500 mb-4 mt-auto">
              By continuing, you agree to Flipkart's <span className="text-flipkart-blue cursor-pointer">Terms of Use</span> and <span className="text-flipkart-blue cursor-pointer">Privacy Policy</span>.
            </p>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-[#ff5200] disabled:bg-gray-400 text-white py-3 font-semibold rounded-sm shadow-md transition mb-3"
            >
              {loading ? "Please wait..." : (isOtpMode ? "Verify OTP" : isRegister ? "Signup" : "Login")}
            </button>

            {!isOtpMode && !isRegister && (
              <button 
                type="button" 
                onClick={handleRequestOtpAction}
                disabled={loading}
                className="w-full bg-white border border-gray-300 text-flipkart-blue hover:shadow-md disabled:text-gray-400 py-3 font-semibold rounded-sm transition"
              >
                Request OTP
              </button>
            )}
            
            <div className="text-center mt-6">
              <span onClick={toggleMode} className="text-sm text-flipkart-blue font-bold cursor-pointer hover:underline">
                {isRegister ? "Existing User? Log in" : "New to Flipkart? Create an account"}
              </span>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;
