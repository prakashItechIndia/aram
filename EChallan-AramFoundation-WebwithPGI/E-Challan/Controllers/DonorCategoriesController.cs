using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using E_Challan.Models;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using System.Data;


namespace E_Challan.Controllers
{
    public class DonorCategoriesController : Controller
    {
        public string strStatusMsg = "";
        public string strDonorType = "";
        #region"--------Donor Setup----------"

        public ActionResult DonorCategories()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Logintest", "Login");
            }
            return View();
        }
        [HttpPost]
        public JsonResult Create(string AccountNo, string DonorTypes, string IsActive,string DonationCode)
        {
            try
            {
                int intUserId = Convert.ToInt32(Session["UserId"]);
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    var check = (from f in ObjEnty.T_DONOR_CATEGORIES where f.Account_Number == AccountNo && f.Donor_Types == DonorTypes && f.Is_Active == true select f).ToList().Count();
                    if (check == 0)
                    {
                        T_DONOR_CATEGORIES tblObj = new T_DONOR_CATEGORIES();
                        tblObj.Account_Number = AccountNo;
                        tblObj.Donor_Types = DonorTypes;
                        tblObj.Is_Active = Convert.ToBoolean(IsActive);
                        tblObj.Donation_Code = DonationCode;
                        tblObj.Is_Deleted = false;
                        tblObj.Created_By = 1;
                        tblObj.Created_Date = DateTime.Today;
                        ObjEnty.T_DONOR_CATEGORIES.Add(tblObj);
                        ObjEnty.SaveChanges();
                        ClsCommon.LogHistory(0, "DonorCategoriesCreation", intUserId);
                        GetDonorCatagoriesList();
                        strStatusMsg = "Created";
                    }
                    else
                    {
                        strStatusMsg = "Error";
                    }

                }
                return Json(new { ClsCommon.lstDonorCategories, strStatusMsg }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public ActionResult GetDonor([DataSourceRequest]DataSourceRequest request)
        {
            GetDonorCatagoriesList();
            return Json(ClsCommon.lstDonorCategories.ToDataSourceResult(request));
        }

        public List<ClsDonorCategories> GetDonorCatagoriesList()
        {
            ClsCommon.lstDonorCategories.Clear();
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    var getdonorlist = (from f in ObjEnty.T_DONOR_CATEGORIES   
                                        where f.Is_Deleted==false         
                                                    select new
                                                    {
                                                        f.Id,
                                                        f.Account_Number,
                                                        f.Donation_Code,
                                                        f.Donor_Types,
                                                        f.Is_Active
                                                    }).ToList();


                    foreach (var a in getdonorlist)
                    {
                        ClsDonorCategories objDonor = new ClsDonorCategories();
                        objDonor.Id = a.Id;
                        objDonor.AccountNo = a.Account_Number;
                        objDonor.DonorTypes = a.Donor_Types;
                        objDonor.DonationCode = a.Donation_Code;
                        if (a.Is_Active == true)
                        {
                            objDonor.strStatus = "Yes";

                        }
                        else if(a.Is_Active == false)
                        {

                            objDonor.strStatus = "No";
                        
                        }

                        ClsCommon.lstDonorCategories.Add(objDonor);
                    }


                     


                }

                


                return ClsCommon.lstDonorCategories;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public JsonResult Edit(string Id)
        {
            ClsDonorCategories obj = new ClsDonorCategories();
            List<ClsDonorCategories> lstdes = new List<ClsDonorCategories>();
            try
            {
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    int intTempId = Convert.ToInt32(Id);
                    var r = (from f in ObjEnty.T_DONOR_CATEGORIES where f.Id == intTempId select f).FirstOrDefault();
                    if (r != null)
                    {
                        obj.Id = r.Id;
                        obj.AccountNo = r.Account_Number;
                        obj.DonorTypes = r.Donor_Types;
                        obj.DonationCode = r.Donation_Code;
                        obj.IsActive = Convert.ToBoolean(r.Is_Active);
                        lstdes.Add(obj);
                    }
                }
                return Json(lstdes, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public JsonResult Edit(int id, string AccountNo, string DonorTypes, string IsActive,string DonationCode)
        {
            try
            {
                int intUserId = Convert.ToInt32(Session["UserId"]);
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {                  
                        var q = (from f in ObjEnty.T_DONOR_CATEGORIES where f.Id == id select f).FirstOrDefault();
                        if (q != null)
                        {
                            q.Account_Number = AccountNo;
                            q.Donor_Types = DonorTypes;
                            q.Is_Active = Convert.ToBoolean(IsActive);
                            q.Donation_Code = DonationCode;
                            //q.ModifiedBy = Convert.ToInt32(Session["UserId"]);
                            // q.ModifiedDate = DateTime.Today;
                            ObjEnty.Entry(q).State = EntityState.Modified;
                            ObjEnty.SaveChanges();
                            ClsCommon.LogHistory(0, "DonorCategoriesUpdation", intUserId);
                            GetDonorCatagoriesList();
                            strStatusMsg = "Updated";
                            GetDonorCatagoriesList();
                        }                                            
                    return Json(new { ClsCommon.lstDonorCategories, strStatusMsg }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
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
                string[] CheckId = id.Split(',');
                using (SaiAramFoundationEntities ObjEnty = new SaiAramFoundationEntities())
                {
                    foreach (var item in CheckId)
                    {
                        int TempId = Convert.ToInt32(item);
                        var q = ObjEnty.T_DONOR_CATEGORIES.Where(a => a.Id == TempId).FirstOrDefault();
                        if (q != null)
                        {
                            var chkExist = ObjEnty.T_EChallan.Where(a => a.Donation_Types == TempId).FirstOrDefault();
                            if (chkExist == null)
                            {
                                q.Is_Deleted = true;
                                q.Is_Active = false;
                                ObjEnty.Entry(q).State = EntityState.Modified;
                                ObjEnty.SaveChanges();
                                ClsCommon.LogHistory(0, "DonorCategoriesDeletion", intUserId);
                                strStatusMsg = "Deleted";
                            }
                            else
                            {
                                var donortype = (from f in ObjEnty.T_DONOR_CATEGORIES where f.Id == TempId select f.Donation_Code).FirstOrDefault();
                                strDonorType = Convert.ToString(donortype);
                                strStatusMsg = "Error";
                                //strStatusMsg = "Funds are provided for the current type.";
                            }
                        }
                    }
                    GetDonorCatagoriesList();
                }
                return Json(new { ClsCommon.lstDonorCategories, strStatusMsg, strDonorType }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion
    }
}
