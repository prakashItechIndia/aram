using E_Challan.Models;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using System.Data;

namespace E_Challan.Controllers
{
    public class AdminChangePasswordController : Controller
    {

        public string strStatusMsg = string.Empty;



        public ActionResult Create()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            GetUserList();
            return View();
        }



        [HttpPost]
        public JsonResult Create(ClsAdminChgPwd obj, int userid)
        {
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    var q = (from f in ObjEnty.T_USER where f.Id == userid select f).FirstOrDefault();
                    if (q != null)
                    {

                        q.Password = ClsCommon.Encryptdata(obj.strPassword);

                        ObjEnty.Entry(q).State = EntityState.Modified;
                        ObjEnty.SaveChanges();

                        strStatusMsg = "Created";
                    }
                }
                return Json(new { strStatusMsg }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        #region "Methods"

       

       

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
                                         
                                     }).OrderByDescending(x => x.intId).ToList();
            }
            ViewBag.Users = new SelectList(ClsCommon.lstUser, "intId", "strName");
            //ViewData["Users"] = ClsCommon.lstUser;
            return ClsCommon.lstUser;
            
        }

        public JsonResult GetUserType(int userid)
        {
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    ClsAdminChgPwd objchg = new ClsAdminChgPwd();
                    var p = (from f in ObjEnty.T_USER where f.Id == userid select f).FirstOrDefault();
                    if (p != null)
                    {
                        objchg.strUserType = p.User_Type;
                    }
                    return Json(objchg.strUserType, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        #endregion



        #region---------------------------------GetPassword----------------------------------------


        public ActionResult GetPassword()
        {
            GetUserList();
            return View();
        }

        public JsonResult GetPwd(int userid)
        {
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    ClsAdminChgPwd objchg = new ClsAdminChgPwd();
                    var p = (from f in ObjEnty.T_USER where f.Id == userid select f).FirstOrDefault();
                    if (p != null)
                    {
                        objchg.strPassword = ClsCommon.Decryptdata(p.Password);
                    }
                    return Json(objchg.strPassword, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        #endregion


    }
}
