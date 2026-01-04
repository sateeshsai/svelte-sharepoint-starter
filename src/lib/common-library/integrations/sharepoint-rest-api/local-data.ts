import type { Sharepoint_UpdateItem_DataResponse } from "./types";

export const LOCAL_SHAREPOINT_USERS_PROPERTIES = [
  {
    AccessRole: "Admin",
    AccountName: "i:0ǵ.t|adfs prod|smodukuru",
    DirectReports: [],
    DisplayName: "Modukuru, Sateeshsai",
    Email: "smodukuru@deloitte.com",
    ExtendedManagers: [],
    ExtendedReports: ["i:0ǵ.t|adfs prod|smodukuru"],
    IsFollowed: false,
    LatestPost: null,
    Peers: [],
    PersonalUrl: "https://people.deloitteresources.com/Person.aspx?accountname=i%3A0%C7%B5%2Et%7Cadfs%20prod%7Csmodukuru",
    PictureUrl: null,
    Title: "V-Exec. Mngr, MK Marketing",
    UserProfileProperties: [
      {
        Key: "UserProfile_GUID",
        Value: "0366e966-f336-4414-a2d1-ed5bf42c1531",
        ValueType: "Edm.String",
      },
      {
        Key: "SID",
        Value: "i:0ǵ.t|adfs prod|smodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "ADGuid",
        Value: "System.Byte[]",
        ValueType: "Edm.String",
      },
      {
        Key: "AccountName",
        Value: "i:0ǵ.t|adfs prod|smodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "FirstName",
        Value: "Sateesh",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PhoneticFirstName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "LastName",
        Value: "Modukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PhoneticLastName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PreferredName",
        Value: "Modukuru, Sateeshsai",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PhoneticDisplayName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "WorkPhone",
        Value: "+16157187215",
        ValueType: "Edm.String",
      },
      {
        Key: "Department",
        Value: "AUDIT PURSUIT COE",
        ValueType: "Edm.String",
      },
      {
        Key: "Title",
        Value: "V-Exec. Mngr, MK Marketing",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-JobTitle",
        Value: "V-Exec. Mngr, MK Marketing",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Department",
        Value: "AUDIT PURSUIT COE",
        ValueType: "Edm.String",
      },
      {
        Key: "Manager",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "AboutMe",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PersonalSpace",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PictureURL",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "UserName",
        Value: "smodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "QuickLinks",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "WebSite",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PublicSiteRedirect",
        Value: "https://people.deloitteresources.com/_layouts/Deloitte.peoplenetwork.api/index.aspx?p%5BidType%5D=adfs&p%5Bid%5D=i%3A0%C7%B5.t%7Cadfs%7Csmodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-DataSource",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-MemberOf",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Dotted-line",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Peers",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Responsibility",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-SipAddress",
        Value: "smodukuru@deloitte.com",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-MySiteUpgrade",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-DontSuggestList",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ProxyAddresses",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-HireDate",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-DisplayOrder",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ClaimID",
        Value: "smodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ClaimProviderID",
        Value: "ADFS Prod",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ClaimProviderType",
        Value: "Trusted",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-LastColleagueAdded",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-OWAUrl",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-SavedAccountName",
        Value: "US\\smodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-SavedSID",
        Value: "System.Byte[]",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ResourceSID",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ResourceAccountName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ObjectExists",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-MasterAccountName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-UserPrincipalName",
        Value: "smodukuru@deloitte.com",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteCapabilities",
        Value: "0",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-O15FirstRunExperience",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteFirstCreationTime",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteLastCreationTime",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteNumberOfRetries",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteFirstCreationError",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteInstantiationState",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-DistinguishedName",
        Value: "CN=Modukuru\\, Sateesh [smodukuru],OU=Users,OU=Practice Office,DC=us,DC=deloitte,DC=com",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-SourceObjectDN",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-LastKeywordAdded",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-FeedIdentifier",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "WorkEmail",
        Value: "smodukuru@deloitte.com",
        ValueType: "Edm.String",
      },
      {
        Key: "CellPhone",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "Fax",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "HomePhone",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "Office",
        Value: "US - Hyderabad",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Location",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "Assistant",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PastProjects",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Skills",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-School",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Birthday",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-StatusNotes",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Interests",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-HashTags",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PictureTimestamp",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-EmailOptin",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PicturePlaceholderState",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PrivacyPeople",
        Value: "False",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PrivacyActivity",
        Value: "0",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PictureExchangeSyncState",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-MUILanguages",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ContentLanguages",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-TimeZone",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-RegionalSettings-FollowWeb",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Locale",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-CalendarType",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-AltCalendarType",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-AdjustHijriDays",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ShowWeeks",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-WorkDays",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-WorkDayStartHour",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-WorkDayEndHour",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Time24",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-FirstDayOfWeek",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-FirstWeekOfYear",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-RegionalSettings-Initialized",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "Country",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "OfficeGraphEnabled",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-UserType",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-HideFromAddressLists",
        Value: "False",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-RecipientTypeDetails",
        Value: "2147483648",
        ValueType: "Edm.String",
      },
      {
        Key: "DelveFlags",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PulseMRUPeople",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "msOnline-ObjectId",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PointPublishingUrl",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-TenantInstanceId",
        Value: "",
        ValueType: "Edm.String",
      },
    ],
    UserUrl: "https://people.deloitteresources.com/Person.aspx?accountname=i%3A0%C7%B5%2Et%7Cadfs%20prod%7Csmodukuru",
  },
  {
    AccountName: "i:0ǵ.t|adfs prod|jmooring",
    DirectReports: [],
    DisplayName: "Mooring, James",
    Email: "jmooring@deloitte.com",
    ExtendedManagers: [],
    ExtendedReports: ["i:0ǵ.t|adfs prod|jmooring"],
    IsFollowed: false,
    LatestPost: null,
    Peers: [],
    PersonalUrl: "https://people.deloitteresources.com/Person.aspx?accountname=i%3A0%C7%B5%2Et%7Cadfs%20prod%7Csmodukuru",
    PictureUrl: null,
    Title: "Sr. Mngr, MK Marketing",
    UserProfileProperties: [
      {
        Key: "UserProfile_GUID",
        Value: "0366e966-f336-4414-a2d1-ed5bf42c1531",
        ValueType: "Edm.String",
      },
      {
        Key: "SID",
        Value: "i:0ǵ.t|adfs prod|jmooring",
        ValueType: "Edm.String",
      },
      {
        Key: "ADGuid",
        Value: "System.Byte[]",
        ValueType: "Edm.String",
      },
      {
        Key: "AccountName",
        Value: "i:0ǵ.t|adfs prod|jmooring",
        ValueType: "Edm.String",
      },
      {
        Key: "FirstName",
        Value: "James",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PhoneticFirstName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "LastName",
        Value: "Mooring",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PhoneticLastName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PreferredName",
        Value: "Mooring, James",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PhoneticDisplayName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "WorkPhone",
        Value: "+16157187215",
        ValueType: "Edm.String",
      },
      {
        Key: "Department",
        Value: "AUDIT PURSUIT COE",
        ValueType: "Edm.String",
      },
      {
        Key: "Title",
        Value: "V-Exec. Mngr, MK Marketing",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-JobTitle",
        Value: "V-Exec. Mngr, MK Marketing",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Department",
        Value: "AUDIT PURSUIT COE",
        ValueType: "Edm.String",
      },
      {
        Key: "Manager",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "AboutMe",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PersonalSpace",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PictureURL",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "UserName",
        Value: "jmooring",
        ValueType: "Edm.String",
      },
      {
        Key: "QuickLinks",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "WebSite",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PublicSiteRedirect",
        Value: "https://people.deloitteresources.com/_layouts/Deloitte.peoplenetwork.api/index.aspx?p%5BidType%5D=adfs&p%5Bid%5D=i%3A0%C7%B5.t%7Cadfs%7Csmodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-DataSource",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-MemberOf",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Dotted-line",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Peers",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Responsibility",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-SipAddress",
        Value: "smodukuru@deloitte.com",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-MySiteUpgrade",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-DontSuggestList",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ProxyAddresses",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-HireDate",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-DisplayOrder",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ClaimID",
        Value: "smodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ClaimProviderID",
        Value: "ADFS Prod",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ClaimProviderType",
        Value: "Trusted",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-LastColleagueAdded",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-OWAUrl",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-SavedAccountName",
        Value: "US\\smodukuru",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-SavedSID",
        Value: "System.Byte[]",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ResourceSID",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ResourceAccountName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ObjectExists",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-MasterAccountName",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-UserPrincipalName",
        Value: "smodukuru@deloitte.com",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteCapabilities",
        Value: "0",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-O15FirstRunExperience",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteFirstCreationTime",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteLastCreationTime",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteNumberOfRetries",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteFirstCreationError",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PersonalSiteInstantiationState",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-DistinguishedName",
        Value: "CN=Modukuru\\, Sateesh [smodukuru],OU=Users,OU=Practice Office,DC=us,DC=deloitte,DC=com",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-SourceObjectDN",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-LastKeywordAdded",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-FeedIdentifier",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "WorkEmail",
        Value: "smodukuru@deloitte.com",
        ValueType: "Edm.String",
      },
      {
        Key: "CellPhone",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "Fax",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "HomePhone",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "Office",
        Value: "US - Hyderabad",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Location",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "Assistant",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PastProjects",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Skills",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-School",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Birthday",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-StatusNotes",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Interests",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-HashTags",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PictureTimestamp",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-EmailOptin",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PicturePlaceholderState",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PrivacyPeople",
        Value: "False",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PrivacyActivity",
        Value: "0",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PictureExchangeSyncState",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-MUILanguages",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ContentLanguages",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-TimeZone",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-RegionalSettings-FollowWeb",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Locale",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-CalendarType",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-AltCalendarType",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-AdjustHijriDays",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-ShowWeeks",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-WorkDays",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-WorkDayStartHour",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-WorkDayEndHour",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-Time24",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-FirstDayOfWeek",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-FirstWeekOfYear",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-RegionalSettings-Initialized",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "Country",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "OfficeGraphEnabled",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-UserType",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-HideFromAddressLists",
        Value: "False",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-RecipientTypeDetails",
        Value: "2147483648",
        ValueType: "Edm.String",
      },
      {
        Key: "DelveFlags",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "PulseMRUPeople",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "msOnline-ObjectId",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-PointPublishingUrl",
        Value: "",
        ValueType: "Edm.String",
      },
      {
        Key: "SPS-TenantInstanceId",
        Value: "",
        ValueType: "Edm.String",
      },
    ],
    UserUrl: "https://people.deloitteresources.com/Person.aspx?accountname=i%3A0%C7%B5%2Et%7Cadfs%20prod%7Csmodukuru",
  },
];

export const LOCAL_SHAREPOINT_USERS = [
  {
    Id: 1,
    IsHiddenInUI: false,
    LoginName: "i:0ǵ.t|adfs prod|smodukuru",
    Title: "Modukuru, Sateeshsai",
    PrincipalType: 1,
    Email: "smodukuru@deloitte.com",
    IsShareByEmailGuestUser: false,
    IsSiteAdmin: true,
    UserId: {
      NameId: "smodukuru",
      NameIdIssuer: "TrustedProvider:adfs prod",
    },
  },
  {
    Id: 2,
    IsHiddenInUI: false,
    LoginName: "i:0ǵ.t|adfs prod|jmooring",
    Title: "Mooring, James",
    PrincipalType: 1,
    Email: "jmooring@deloitte.com",
    IsShareByEmailGuestUser: false,
    IsSiteAdmin: true,
    UserId: {
      NameId: "jmooring",
      NameIdIssuer: "TrustedProvider:adfs prod",
    },
  },
];

export const LOCAL_LIST_ITEM_UPDATE_SUCCESS_RESPONSE: Sharepoint_UpdateItem_DataResponse = {
  ok: true,
  status: 200,
  statusText: "Success!",
};
