import Property from "../../../models/property.model.js";
import PropertyRequest from "../../../models/propertyRequest.model.js";
import PropertyOwner from "../../../models/propertyOwner.model.js";
import ApiError from "../../../utils/ApiError.js";
import * as kadastr from "./kadastr.provider.js";
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_VALUES,
  TERMINAL_STATUSES,
} from "../yer.constants.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ----- Properties -----

export const listProperties = async ({
  region,
  district,
  type,
  status,
  ownerJshshir,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = {};
  if (region) filter.region = region;
  if (district) filter.district = district;
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (ownerJshshir) filter.ownerJshshir = ownerJshshir;

  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ cadastreNumber: rx }, { address: rx }, { ownerJshshir: rx }];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Property.find(filter).sort({ registeredAt: -1 }).skip(skip).limit(limit),
    Property.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

export const getProperty = async (id) => {
  const property = await Property.findById(id);
  if (!property) throw new ApiError(404, "Mulk obyekti topilmadi");
  return property;
};

export const createProperty = async (body) => {
  const taken = await kadastr.isCadastreNumberTaken(body.cadastreNumber);
  if (taken) throw new ApiError(409, "Bunday kadastr raqami allaqachon mavjud");
  return Property.create(body);
};

export const updateProperty = async (id, body) => {
  const property = await getProperty(id);
  const fields = [
    "type",
    "region",
    "district",
    "address",
    "areaM2",
    "valueUzs",
    "ownershipType",
    "ownerJshshir",
    "status",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) property[f] = body[f];
  }
  await property.save();
  return property;
};

// Public registry lookup by cadastre number (open service)
export const checkRegistry = async (cadastreNumber) => {
  const property = await kadastr.getByCadastreNumber(cadastreNumber);
  if (!property) throw new ApiError(404, "Reyestrdan obyekt topilmadi");
  return property;
};

// Citizen's own properties (by JSHSHIR)
export const getPropertiesByOwner = async (jshshir) => {
  return Property.find({ ownerJshshir: jshshir }).sort({ registeredAt: -1 });
};

// ----- Requests -----

const genRequestNumber = async () => {
  const year = new Date().getFullYear();
  const count = await PropertyRequest.countDocuments();
  const seq = String(count + 1).padStart(5, "0");
  return `YER-${year}-${seq}`;
};

export const listRequests = async ({
  status,
  serviceType,
  region,
  applicantJshshir,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = {};
  if (status) filter.status = status;
  if (serviceType) filter.serviceType = serviceType;
  if (region) filter.region = region;
  if (applicantJshshir) filter.applicantJshshir = applicantJshshir;

  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [
      { requestNumber: rx },
      { applicantJshshir: rx },
      { applicantName: rx },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    PropertyRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("propertyId", "cadastreNumber address region type"),
    PropertyRequest.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

export const getRequest = async (id) => {
  const request = await PropertyRequest.findById(id).populate(
    "propertyId",
    "cadastreNumber address region type areaM2 ownershipType",
  );
  if (!request) throw new ApiError(404, "Ariza topilmadi");
  return request;
};

export const createRequest = async (body) => {
  const requestNumber = await genRequestNumber();
  const request = await PropertyRequest.create({
    requestNumber,
    propertyId: body.propertyId || null,
    serviceType: body.serviceType,
    applicantJshshir: body.applicantJshshir,
    applicantName: body.applicantName || "",
    region: body.region || "",
    status: REQUEST_STATUSES.NEW,
    events: [{ status: REQUEST_STATUSES.NEW, comment: "Ariza qabul qilindi" }],
  });
  return request;
};

export const updateRequestStatus = async (id, body) => {
  const request = await getRequest(id);
  if (TERMINAL_STATUSES.includes(request.status)) {
    throw new ApiError(409, "Ariza yakunlangan, holatni o'zgartirib bo'lmaydi");
  }

  if (body.status !== undefined) {
    if (!REQUEST_STATUS_VALUES.includes(body.status)) {
      throw new ApiError(400, "Holat noto'g'ri");
    }
    request.status = body.status;
    request.events.push({
      status: body.status,
      comment: body.comment || "",
    });
  }

  if (body.invoiceAmount !== undefined) request.invoiceAmount = body.invoiceAmount;
  if (body.paid !== undefined) request.paid = !!body.paid;
  if (body.operatorNote !== undefined) request.operatorNote = body.operatorNote;

  await request.save();
  return request;
};

export const getRequestsByApplicant = async (jshshir) => {
  return PropertyRequest.find({ applicantJshshir: jshshir })
    .sort({ createdAt: -1 })
    .populate("propertyId", "cadastreNumber address region type");
};

// ----- Owner lookup (demo One ID) -----

export const getOwnerByJshshir = async (jshshir) => {
  return PropertyOwner.findOne({ jshshir });
};
