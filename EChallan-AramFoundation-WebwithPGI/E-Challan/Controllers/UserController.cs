 using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using E_Challan.Models;
using System.Data;

namespace E_Challan.Controllers
{
    public class UserController : Controller
    {
        public string strStatusMsg = string.Empty;

        public ActionResult Create()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            int intUserId = Convert.ToInt32(Session["UserId"]);
            ViewData["UserID"] = intUserId;
            return View();
        }


        [HttpPost]
        public JsonResult Create(ClsUser obj)
        {
            try
            {
                int intUserId = Convert.ToInt32(Session["UserId"]);
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    T_USER tblObj = new T_USER();

                    tblObj.Name = obj.strName;
                    tblObj.Password = ClsCommon.Encryptdata(obj.strPassword);
                    tblObj.User_Name = obj.strUserName;
                    tblObj.User_Type = obj.strUserType;
                    tblObj.Mobile_Number = obj.strMobile;
                    tblObj.E_Mail = obj.strEmail;
                   // tblObj.Location = obj.strLocation;
                    tblObj.Is_Active = true;

                    tblObj.Created_By = 1;
                    tblObj.Created_Date = DateTime.Today;
                    ObjEnty.T_USER.Add(tblObj);
                    ObjEnty.SaveChanges();
                    ClsCommon.LogHistory(0, "ProfileCreation", intUserId);
                    GetUserList();
                    strStatusMsg = "Created";
                    ClsCommon.Mail(obj.strEmail, "ARAM Foundation E-Challan: New user account has been created for you! ", "Dear Sir/Madam, <br/> <br/>We are pleased to inform you that, we have created new user account for you to access <b>ARAM Foundation E-Challan Application</b>.<br/> <br/> Your User Name : <b>" + obj.strUserName + "</b><br/> Password : <b>" + obj.strPassword, "</b>", "");
                }
                return Json(new { ClsCommon.lstUser, strStatusMsg }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet]
        public JsonResult Edit(int id)
        {
            ClsUser objuser = new ClsUser();
            List<ClsUser> lstusers = new List<ClsUser>();
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {

                    var r = (from f in ObjEnty.T_USER where f.Id == id select f).FirstOrDefault();
                    if (r != null)
                    {
                        objuser.intId = r.Id;
                        objuser.strName = r.Name;
                        objuser.strUserName = r.User_Name;
                       // objuser.strLocation = r.Location;
                        objuser.strPassword =ClsCommon.Decryptdata(r.Password);
                        objuser.strMobile = r.Mobile_Number;
                        objuser.strUserType = r.User_Type;
                        objuser.strEmail = r.E_Mail;
                        
                        lstusers.Add(objuser);

                    }
                }
                return Json(lstusers, JsonRequestBehavior.AllowGet);



                //ClsDesignation Objdesign = (from f in ClsCommon.lstDesignation where f.Id == id select f).FirstOrDefault();
                //if (Objdesign!=null)
                //{
                //    return Json(Objdesign, JsonRequestBehavior.AllowGet);
                //}
                //return Json("", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        [HttpPost]
        public JsonResult Edit(ClsUser obj,int id)
        {
            try
            {
                int intUserId = Convert.ToInt32(Session["UserId"]);
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    var q = (from f in ObjEnty.T_USER where f.Id == id select f).FirstOrDefault();
                    if (q != null)
                    {
                        q.Name = obj.strName;
                        q.User_Name = obj.strUserName;
                        q.User_Type = obj.strUserType;
                       // q.Location = obj.strLocation;
                        //q.Password = ClsCommon.Encryptdata(obj.strPassword);
                        q.Mobile_Number = obj.strMobile;
                        q.E_Mail = obj.strEmail;
                       
                       // q.Modified_By = 1;
                       // q.Modified_Date = DateTime.Today;
                        ObjEnty.Entry(q).State = EntityState.Modified;
                        ObjEnty.SaveChanges();
                        GetUserList();
                        ClsCommon.LogHistory(0, "ProfileModification", intUserId);
                        strStatusMsg = "Updated";
                        string strDecryPwd = ClsCommon.Decryptdata(q.Password);
                        ClsCommon.Mail(obj.strEmail, "ARAM Foundation E-Challan: User account has been updated for you! ", "Dear Sir/Madam, <br/> <br/>We are pleased to inform you that, we have updated your user account for you to access SAI ECHALLAN SITE.<br/> <br/> Your User Name : <b>" + obj.strUserName + "</b><br/> Password :<b> " + strDecryPwd, "</b", "");
                    }
                    return Json(new { ClsCommon.lstUser, strStatusMsg }, JsonRequestBehavior.AllowGet);
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet]
        public JsonResult Delete(string id)
        {
            int intUserId = Convert.ToInt32(Session["UserId"]);
            try
            {
                string[] checkItem = id.Split(',');
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    foreach (string f in checkItem)
                    {
                        int ff = Convert.ToInt32(f);
                        var q = (from p in ObjEnty.T_USER where p.Id == ff select p).FirstOrDefault();
                        var currentuser = (from p in ObjEnty.T_USER where ff == intUserId select p).FirstOrDefault();
                        if (q != null && currentuser==null)
                        {
                            q.Is_Active = false;

                            ObjEnty.Entry(q).State = EntityState.Modified;
                            ObjEnty.SaveChanges();
                            strStatusMsg = "Deleted";
                            ClsCommon.LogHistory(0, "ProfileDelete", intUserId);
                        }

                    }
                    //GetUserList();
                }
                return Json(strStatusMsg, JsonRequestBehavior.AllowGet);
            }

            catch(Exception ex)
            {
                throw ex;
            }

        }

        #region "Methods"

        public ActionResult GetUser([DataSourceRequest]DataSourceRequest request)
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }

            GetUserList();
            return Json(ClsCommon.lstUser.ToDataSourceResult(request));
        }

        public List<ClsUser> GetUserList()
        {
            ClsCommon.lstUser.Clear();
            using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
            {
                ClsCommon.lstUser = (from f in ObjEnty.T_USER
                                            where f.Is_Active == true
                                            select new ClsUser
                                            {
                                                intId = f.Id,
                                                strName = f.Name,
                                                strUserName = f.User_Name,
                                                strEmail=f.E_Mail,
                                                strMobile=f.Mobile_Number,
                                                strPassword=f.Password,
                                                strUserType=f.User_Type,
                                               // strLocation=f.Location
                                            }).OrderByDescending(x => x.intId).ToList();
            }
            return ClsCommon.lstUser;
        }

        #endregion

    }
}
