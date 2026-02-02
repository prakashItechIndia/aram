using E_Challan.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace E_Challan.Controllers
{
    public class LoginController : Controller
    {
        public string strStatusMsg = string.Empty;


        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Logintest()
        {
            return View();
        }



        [HttpPost]
        public ActionResult Logintest(ClsLogin obj)
        {
            try
            {
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {
                    var login = (from a in objEnty.T_USER where a.User_Name == obj.strUsername && a.Is_Active == true select a).FirstOrDefault();
                    if (login != null)
                    {
                        string strDcrptPass = ClsCommon.Decryptdata(login.Password);
                        if (strDcrptPass == obj.strPassword)
                        {
                            Session["UserId"] = login.Id;
                            Session["UserType"] = login.User_Type;
                            Session["UserName"] = login.User_Name;
                            if (login.User_Type == "Super Admin")
                            {
                                ClsCommon.LogHistory(0, "AdminLogin", login.Id);
                                return RedirectToAction("Dashboard", "Dashboard");
                            }
                            else if (login.User_Type == "Admin")
                            {
                                ClsCommon.LogHistory(0, "AdminLogin", login.Id);
                                return RedirectToAction("Dashboard", "Dashboard");
                            }

                            else
                            {
                                ClsCommon.LogHistory(0, "UserLogin", login.Id);
                                return RedirectToAction("EChallan", "EChallan");
                            }

                        }
                        else
                        {
                            TempData["Login"] = "WrongPassword";
                            return View();
                        }
                    }
                    else
                    {
                        TempData["Login"] = "WrongUsername";
                        return View();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        [HttpPost]
        public ActionResult Login(ClsLogin obj)
        {
            try
            {
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {
                    var login = (from a in objEnty.T_USER where a.User_Name == obj.strUsername && a.Is_Active == true select a).FirstOrDefault();
                    if (login != null)
                    {
                        string strDcrptPass = ClsCommon.Decryptdata(login.Password);
                        if (strDcrptPass == obj.strPassword)
                        {
                            Session["UserId"] = login.Id;
                            Session["UserType"] = login.User_Type;
                            Session["UserName"] = login.User_Name;
                            if (login.User_Type == "Admin")
                            {
                                ClsCommon.LogHistory(0, "AdminLogin", login.Id);
                                return RedirectToAction("Dashboard", "Dashboard");
                            }

                            else
                            {
                                ClsCommon.LogHistory(0, "UserLogin", login.Id);
                                return RedirectToAction("EChallan", "EChallan");
                            }

                        }
                        else
                        {
                            TempData["Login"] = "WrongPassword";
                            return View();
                        }
                    }
                    else
                    {
                        TempData["Login"] = "WrongUsername";
                        return View();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ActionResult Logout()
        {
            try
            {
                Session.Abandon();
                return RedirectToAction("Logintest", "Login");
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public ActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ForgotPswd(string strEmail)
        {
            string strStatusMsg = "";
            try
            {
                using (SaiAramFoundationEntities objEnty = new SaiAramFoundationEntities())
                {
                    var Email = (from a in objEnty.T_USER where a.E_Mail == strEmail && a.Is_Active == true select a).FirstOrDefault();
                    if (Email != null)
                    {
                        string strDcrptPass = ClsCommon.Decryptdata(Email.Password);
                        ClsCommon.Mail(Email.E_Mail, "SAIRAM ARAM FOUNDATION: Forget Password ", "Dear Sir/Madam, <br>Your Password : <b>" + strDcrptPass, "</b></br>", "");
                        strStatusMsg = "Success";
                    }
                    else
                    {
                        strStatusMsg = "Error";
                    }
                    return Json(strStatusMsg, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region------------------------------Change Password---------------------

        public ActionResult CommonChangePassword()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            return View();
        }

        [HttpPost]
        public JsonResult ChangePassword(ClsLogin obj)
        {
            string strDecrptPassword = "";
            try
            {
                int intUserId = Convert.ToInt32(Session["UserId"]);

                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    var User = (from f in ObjEnty.T_USER where f.Id == intUserId select f).FirstOrDefault();

                    if (User != null)
                    {
                        strDecrptPassword = ClsCommon.Decryptdata(User.Password);

                        if (strDecrptPassword == obj.strPassword)
                        {
                            string strEncryptpassword = ClsCommon.Encryptdata(obj.strConfirmPassword);
                            User.Password = strEncryptpassword;
                            ObjEnty.Entry(User).State = EntityState.Modified;
                            ObjEnty.SaveChanges();
                            strStatusMsg = "success";
                        }
                    }
                    else
                    {
                        strStatusMsg = "error";
                    }

                }
                return Json(strStatusMsg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion




    }
}
