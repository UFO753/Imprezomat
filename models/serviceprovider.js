const serviceprovider = new mongoose.Schema({
  globalname: String,
  description: String,
  category1: String,
  category2: String,
  category3: String,
  photo: String,
});

const ServiceProviderModel = mongoose.model(
  "ServiceProviderModel",
  serviceprovider,
  "servicesproviders"
);

module.exports = ServiceProviderModel;
