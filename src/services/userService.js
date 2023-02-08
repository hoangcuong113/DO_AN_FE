import axios from "../axios";
const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsers = (userId, token) => {
  return axios.get(`/api/get-all-users?id=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const handleGetUserByEmail = (email, token) => {
  return axios.get(`/api/get-user-by-email?email=${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getInfoUser = (userId) => {
  return axios.get(`/api/home-get-all-users?id=${userId}`);
};

const getAllDoctorForHome = () => {
  return axios.get(`/api/home-get-all-doctocs`);
};

const addUserService = (data, token) => {
  return axios.post("/api/create-user", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const userSignUp = (data) => {
  return axios.post("/api/patient-create-user", data);
};

const deleteUserService = (userId, token) => {
  return axios.delete("/api/delete-user", {
    headers: { Authorization: `Bearer ${token}` },
    data: { id: userId },
  });
};

const editUserService = (inputData, token) => {
  return axios.put("/api/edit-user", inputData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const userEditInfo = (inputData) => {
  return axios.put("/api/home-edit-user", inputData);
};

const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?inputType=${inputType}`);
};

const getTopDoctorForHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctorService = (token) => {
  return axios.get(`/api/get-all-doctocs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const saveInfoDoctorService = (data) => {
  return axios.post(`/api/creat-info-doctor`, data);
};

const getInfoDoctorService = (id) => {
  return axios.get(`/api/get-info-doctor?id=${id}`);
};

const getAllTimeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const saveScheduleService = (data) => {
  return axios.post("/api/save-schedule", data);
};

const getScheduleDoctorService = (doctorId, date) => {
  return axios.get(`/api/schedule-doctor?doctorId=${doctorId}&date=${date}`);
};

const deleteScheduleDoctorService = (scheduleId) => {
  return axios.delete("/api/delete-schedule-doctor", {
    data: { id: scheduleId },
  });
};

const getExtraDoctorInfoService = (doctorId) => {
  return axios.get(`/api/extra-doctor-info?doctorId=${doctorId}`);
};

const savePatientBooking = (data) => {
  console.log('data',data);
  return axios.post("/api/patient-booking", data);
};

const postVerifyPatientBooking = (data) => {
  return axios.post("/api/verify-patient-booking", data);
};

const saveSpecialtyService = (data, token) => {
  return axios.post("/api/create-specialty", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getAllSpecialties = (token) => {
  return axios.get(`/api/get-all-specialty`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getAllSpecialtiesForHome = () => {
  return axios.get(`/api/home-get-all-specialty`);
};

const editSpecialtyService = (data) => {
  return axios.put("/api/edit-specialty", data);
};

const deleteSpecialtyService = (specialtyId) => {
  return axios.delete("/api/delete-specialty", { data: { id: specialtyId } });
};

const changePWService = (data) => {
  return axios.post("/api/change-user-pw", data);
};

const forgotPWService = (data) => {
  return axios.post("/api/forgot-pw", data);
};

const ConfirmForgotPWService = (data) => {
  return axios.post("/api/verify-forgot-pw", data);
};

const getSpecialyById = (data) => {
  return axios.get(
    `/api/specialty-by-id?id=${data.id}&location=${data.location}`
  );
};

const saveClinicService = (data, token) => {
  return axios.post("/api/create-clinic", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getAllClinic = (token) => {
  return axios.get(`/api/get-all-clinic`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getAllClinicForHome = () => {
  return axios.get(`/api/home-get-all-clinic`);
};

const editClinicService = (data) => {
  return axios.put("/api/edit-clinic", data);
};

const deleteClinicService = (clinicId) => {
  return axios.delete("/api/delete-clinic", { data: { id: clinicId } });
};

const getClinicById = (clinicId) => {
  return axios.get(`/api/get-clinic-by-id?id=${clinicId}`);
};

const getAppointmenDoctorService = (doctorId, date) => {
  return axios.get(
    `/api/get-appointment-doctor?doctorId=${doctorId}&date=${date}`
  );
};

const getHistoryDoctorService = (doctorId, date) => {
  return axios.get(`/api/get-history-doctor?doctorId=${doctorId}&date=${date}`);
};

const sendEmailToCustomer = (data) => {
  return axios.post("/api/send-mail-to-customers", data);
};

const confirmAppointmentSucceed = (data) => {
  console.log('dataService',data);
  return axios.post("/api/confirm-succeed-appointment", data);
};

const cancelAppointment = (data) => {
  return axios.post("/api/cancel-appointment", data);
};

const patientCancelAppointment = (data) => {
  return axios.post("/api/patient-cancel-appoinment", data);
};

const saveHandBookService = (data) => {
  return axios.post("/api/create-handbook", data);
};

const getAllHandBook = (token) => {
  return axios.get(`/api/get-all-handbook`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const editHandBookService = (data) => {
  return axios.put("/api/edit-handbook", data);
};

const deleteHandBookService = (handBookId) => {
  return axios.delete("/api/delete-handbook", { data: { id: handBookId } });
};

const getHandBookById = (handBookId) => {
  return axios.get(`/api/get-handbook-by-id?id=${handBookId}`);
};

const getPatientAppointmentService = (patientId) => {
  return axios.get(`/api/get-patient-appoinment?patientId=${patientId}`);
};

const postRating = (data) => {
  return axios.post("/api/post-rating", data);
};

const getRating = (doctorId) => {
  return axios.get(`/api/get-rating?doctorId=${doctorId}`);
};

export {
  handleLoginApi,
  getAllUsers,
  handleGetUserByEmail,
  addUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorForHomeService,
  getAllDoctorService,
  saveInfoDoctorService,
  getInfoDoctorService,
  getAllTimeService,
  saveScheduleService,
  getScheduleDoctorService,
  getExtraDoctorInfoService,
  savePatientBooking,
  postVerifyPatientBooking,
  saveSpecialtyService,
  getAllSpecialties,
  editSpecialtyService,
  deleteSpecialtyService,
  deleteScheduleDoctorService,
  changePWService,
  forgotPWService,
  ConfirmForgotPWService,
  getSpecialyById,
  saveClinicService,
  getAllClinic,
  editClinicService,
  deleteClinicService,
  getClinicById,
  getAppointmenDoctorService,
  sendEmailToCustomer,
  confirmAppointmentSucceed,
  getAllClinicForHome,
  getAllSpecialtiesForHome,
  getAllDoctorForHome,
  saveHandBookService,
  getAllHandBook,
  editHandBookService,
  deleteHandBookService,
  getHandBookById,
  cancelAppointment,
  getHistoryDoctorService,
  userSignUp,
  userEditInfo,
  getInfoUser,
  getPatientAppointmentService,
  postRating,
  getRating,
  patientCancelAppointment,
};
