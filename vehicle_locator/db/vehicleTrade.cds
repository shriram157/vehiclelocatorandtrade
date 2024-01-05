context vehicleTrade {
    
    entity Trade_Request {
            @title : 'Trade_Id'
        key Trade_Id               : String(8);
            COMMENTS               : association[1, 0..*] to Trade_Comment on COMMENTS.Trade_Id = Trade_Id;
            Vehicle                : Association to many Vehicle on Vehicle.Trade_Id = Trade_Id;
            Vehicle_Desc           : Association to many Vehicle_Desc on Vehicle_Desc.Trade_Id = Trade_Id;

            @title : 'Trade Status Value'
            Trade_Status           : String(1);

            @title : 'Requesting Dealer'
            Requesting_Dealer      : String(10);

            @title : 'Requesting_Dealer_Name'
            Requesting_Dealer_Name : String(35);

            @title : 'Requested Dealer'
            Requested_Dealer      : String(10);

            @title : 'Requested_Dealer_Name'
            Requested_Dealer_Name : String(35);

            @title : 'Requested Vehicle VTN'
            Requested_Vtn          : String(7);

            @title : 'Offered Vehicle VTN'
            Offered_Vtn            : String(7);

            @title : 'Trade In Return'
            Trade_Return           : String(1);

            @title : 'Reqested Vehicle Current ETA From '
            Req_Current_ETA_From   : Date;

            @title : 'Requested Vehicle Current ETA To'
            Req_Current_ETA_To     : Date;

            @title : 'Requested Vehicle Proposed ETA From'
            Req_Proposed_ETA_From  : Date;

            @title : 'Requested Vehicle Proposed ETA To'
            Req_Proposed_ETA_To    : Date;

            @title : 'Offered Vehicle Current ETA From'
            Off_Current_ETA_From   : Date;

            @title : 'Offered Vehicle Current ETA To'
            Off_Current_ETA_To     : Date;

            @title : 'Offered Vehicle Proposed ETA From'
            Off_Proposed_ETA_From  : Date;

            @title : 'Offered Vehicle Proposed ETA To'
            Off_Proposed_ETA_To    : Date;
            
            @title : 'Created by'
            Created_By             : String(12);

            @title : 'Created on'
            Created_On             : Date;

            @title : 'Changed on'
            Changed_on             : Date;

            @title : 'Vehicle VIN'
            VIN : String(35);
    }
    // technical configuration {
    //     column store;
    // };

    
    @title : 'Trade Comments'
    entity Trade_Comment {
        key Trade_Id     :   String(8);

            @title : 'Comment ID'
        key Comment_Id   : String(2);

            @title : 'Comment Text'
            Comment_Txt  : String(1024);

            @title : 'Comment Date'
            Comment_Date : Date;

            @title : 'Created By'
            Created_By   : String(12);
    }
    // technical configuration {
    //     column store;
    // };

    
    @title : 'Vehicle'
    entity Vehicle {
        key Trade_Id    : String(8);

            @title : 'Vehicle VTN'
        key VTN        : String(7);

            @title : 'Model Year'
            Model_Year : String(4);

            @title : 'Model'
            Model      : String(40);

            @title : 'Series'
            Series     : String(3);

            @title : 'Suffix'
            Suffix     : String(2);

            @title : 'Inerior Colour'
            Int_Colour : String(4);

            @title : 'Exterior Colour'
            Ext_Colour : String(4);

            @title : 'APX'
            APX        : String(2);

            @title : 'DNC'
            DNC        : String(1);

            @title : 'Status'
            Status     : String(1);

            @title : 'Order Type'
            Order_Type : String(2);

            @title : 'Accessory Installed Y or N'
            AccessoryInstalled : String(1);

            @title : 'Vehicle VIN'
            VIN : String(35);
    }
    // technical configuration {
    //     column store;
    // };

    
    @title : 'Vehicle Descriptions'
    entity Vehicle_Desc {
        key Trade_Id         : String(8);
        key VTN                : String(7);

            @title : 'Language'
        key SPRAS           : String(2);

            @title : 'Model Description'
            Model_Desc      : String(40);

            @title : 'Series Description'
            Series_Desc     : String(50);

            @title : 'Suffix Description'
            Suffix_Desc     : String(30);

            @title : 'Inerior Colour Description'
            Int_Colour_Desc : String(30);

            @title : 'Exterior Colour Description'
            Ext_Colour_Desc : String(50);
    }
    // technical configuration {
    //     column store;
    // };

    
    @title : 'Trade Status'
    entity Trade_Status {
        key Value      : association[1, 1..*] to Trade_Request { Trade_Status };

            @title : 'Description'
            Description : String(10);
    }
    // technical configuration {
    //     column store;
    // };
    
    
    @title : 'Trade Return'
    entity Trade_Return {
       key value : association[1, 1..*] to Trade_Request { Trade_Return };
          @title : 'Description'
          Description : String(3);
    }
 
    
};