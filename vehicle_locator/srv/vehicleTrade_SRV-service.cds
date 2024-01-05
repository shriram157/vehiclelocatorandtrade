using vehicleTrade as TradeRequest from '../db/vehicleTrade';
using vehicleTrade as TradeComment from '../db/vehicleTrade';
using vehicleTrade as TradeVehicles from '../db/vehicleTrade';
using vehicleTrade as TradeVehicleDesc from '../db/vehicleTrade';
using vehicleTrade as TradeStatus from '../db/vehicleTrade';
using vehicleTrade as TradeReturn from '../db/vehicleTrade';

service vehicleTrade_SRV @(path : '/vehicleTrade') { 
    entity Trade_Request as projection on TradeRequest.Trade_Request;
    entity Trade_Comment as projection on TradeComment.Trade_Comment;
    entity Vehicle as projection on TradeVehicles.Vehicle;
    entity Vehicle_Desc as projection on TradeVehicleDesc.Vehicle_Desc;
    entity Trade_Status as projection on TradeStatus.Trade_Status;
    entity Trade_Return as projection on TradeReturn.Trade_Return;
}
