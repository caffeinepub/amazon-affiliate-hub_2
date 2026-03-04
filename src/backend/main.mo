import Map "mo:core/Map";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Product = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
    price : Float;
    category : Text;
    affiliateLink : Text;
    rating : Float;
    featured : Bool;
    dealOfDay : Bool;
    brand : Text;
    vendor : Text;
    createdAt : Int;
  };

  public type Brand = {
    id : Nat;
    name : Text;
    logoUrl : Text;
    category : Text;
    affiliateLink : Text;
  };

  public type SocialLinks = {
    facebook : Text;
    twitter : Text;
    threads : Text;
    instagram : Text;
    telegram : Text;
    whatsapp : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type SellerListingStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type SellerListing = {
    id : Nat;
    sellerId : Principal;
    title : Text;
    description : Text;
    imageUrl : Text;
    price : Float;
    category : Text;
    commissionRate : Float;
    shippingInfo : Text;
    contactEmail : Text;
    contactWhatsApp : Text;
    status : SellerListingStatus;
    createdAt : Int;
  };

  public type SellerProfile = {
    sellerId : Principal;
    storeName : Text;
    description : Text;
    contactEmail : Text;
    contactWhatsApp : Text;
    logoUrl : Text;
    createdAt : Int;
  };

  // Orders types
  public type OrderStatus = {
    #pending;
    #forwarded;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type OrderType = {
    #affiliate;
    #marketplace;
  };

  public type Order = {
    id : Nat;
    customerId : Principal;
    customerName : Text;
    customerEmail : Text;
    customerPhone : Text;
    customerAddress : Text;
    productId : Nat;
    productTitle : Text;
    orderType : OrderType;
    sellerListingId : ?Nat;
    quantity : Nat;
    sellingPrice : Float;
    status : OrderStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  var productCounter = 0;
  var brandCounter = 0;
  var sellerListingCounter = 0;
  var orderCounter = 0;

  let products = Map.empty<Nat, Product>();
  let brands = Map.empty<Nat, Brand>();
  let sellerListings = Map.empty<Nat, SellerListing>();
  let sellerProfiles = Map.empty<Principal, SellerProfile>();
  let orders = Map.empty<Nat, Order>();

  var socialLinks : SocialLinks = {
    facebook = "";
    twitter = "";
    threads = "";
    instagram = "";
    telegram = "";
    whatsapp = "";
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  var affiliateCode : Text = "";

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addProduct(
    title : Text,
    description : Text,
    imageUrl : Text,
    price : Float,
    category : Text,
    affiliateLink : Text,
    rating : Float,
    brand : Text,
    vendor : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    productCounter += 1;
    let newProduct : Product = {
      id = productCounter;
      title;
      description;
      imageUrl;
      price;
      category;
      affiliateLink;
      rating;
      featured = false;
      dealOfDay = false;
      brand;
      vendor;
      createdAt = Time.now();
    };
    products.add(productCounter, newProduct);
    productCounter;
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductById(id : Nat) : async ?Product {
    products.get(id);
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    title : Text,
    description : Text,
    imageUrl : Text,
    price : Float,
    category : Text,
    affiliateLink : Text,
    rating : Float,
    brand : Text,
    vendor : Text,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Update failed: Product not found for id " # id.toText()) };
      case (?existingProduct) {
        let updatedProduct : Product = {
          existingProduct with
          title;
          description;
          imageUrl;
          price;
          category;
          affiliateLink;
          rating;
          brand;
          vendor;
        };
        products.add(id, updatedProduct);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
    true;
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let matches = products.filter(
      func(_id, product) { Text.equal(product.category, category) }
    );
    matches.values().toArray();
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    let matches = products.filter(
      func(_id, product) { product.featured }
    );
    matches.values().toArray();
  };

  public query ({ caller }) func getDealOfDay() : async [Product] {
    let matches = products.filter(
      func(_id, product) { product.dealOfDay }
    );
    matches.values().toArray();
  };

  public shared ({ caller }) func setDealOfDay(id : Nat, value : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set deal of day");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found for id " # id.toText()) };
      case (?existingProduct) {
        let updatedProduct : Product = {
          existingProduct with
          dealOfDay = value;
        };
        products.add(id, updatedProduct);
        true;
      };
    };
  };

  public shared ({ caller }) func setFeatured(id : Nat, value : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set featured products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found for id " # id.toText()) };
      case (?existingProduct) {
        let updatedProduct : Product = {
          existingProduct with
          featured = value;
        };
        products.add(id, updatedProduct);
        true;
      };
    };
  };

  public shared ({ caller }) func addBrand(
    name : Text,
    logoUrl : Text,
    category : Text,
    affiliateLink : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add brands");
    };
    brandCounter += 1;
    let newBrand : Brand = {
      id = brandCounter;
      name;
      logoUrl;
      category;
      affiliateLink;
    };
    brands.add(brandCounter, newBrand);
    brandCounter;
  };

  public query ({ caller }) func getBrands() : async [Brand] {
    brands.values().toArray();
  };

  public shared ({ caller }) func deleteBrand(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete brands");
    };
    brands.remove(id);
    true;
  };

  public query ({ caller }) func getSocialLinks() : async SocialLinks {
    socialLinks;
  };

  public shared ({ caller }) func updateSocialLinks(links : SocialLinks) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update social links");
    };
    socialLinks := links;
    true;
  };

  public query ({ caller }) func getAffiliateCode() : async Text {
    affiliateCode;
  };

  public shared ({ caller }) func setAffiliateCode(code : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set affiliate code");
    };
    affiliateCode := code;
    true;
  };

  public shared ({ caller }) func submitSellerListing(
    title : Text,
    description : Text,
    imageUrl : Text,
    price : Float,
    category : Text,
    shippingInfo : Text,
    contactEmail : Text,
    contactWhatsApp : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit seller listings");
    };
    sellerListingCounter += 1;
    let newListing : SellerListing = {
      id = sellerListingCounter;
      sellerId = caller;
      title;
      description;
      imageUrl;
      price;
      category;
      commissionRate = 50.0;
      shippingInfo;
      contactEmail;
      contactWhatsApp;
      status = #pending;
      createdAt = Time.now();
    };
    sellerListings.add(sellerListingCounter, newListing);
    sellerListingCounter;
  };

  public query ({ caller }) func getSellerListings() : async [SellerListing] {
    let filteredListings = List.empty<SellerListing>();
    for ((id, listing) in sellerListings.entries()) {
      if (listing.status == #approved) {
        filteredListings.add(listing);
      };
    };
    filteredListings.values().toArray();
  };

  public query ({ caller }) func getPendingSellerListings() : async [SellerListing] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending listings");
    };
    let filteredListings = List.empty<SellerListing>();
    for ((id, listing) in sellerListings.entries()) {
      if (listing.status == #pending) {
        filteredListings.add(listing);
      };
    };
    filteredListings.values().toArray();
  };

  public query ({ caller }) func getAllSellerListingsAdmin() : async [SellerListing] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all listings");
    };
    sellerListings.values().toArray();
  };

  public query ({ caller }) func getMySellerListings() : async [SellerListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their listings");
    };
    let filteredListings = List.empty<SellerListing>();
    for ((_, listing) in sellerListings.entries()) {
      if (listing.sellerId == caller) {
        filteredListings.add(listing);
      };
    };
    filteredListings.values().toArray();
  };

  public query ({ caller }) func getSellerListingById(id : Nat) : async ?SellerListing {
    sellerListings.get(id);
  };

  public shared ({ caller }) func updateSellerListingStatus(id : Nat, status : SellerListingStatus) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update seller listing status");
    };
    switch (sellerListings.get(id)) {
      case (null) { Runtime.trap("Update failed: SellerListing not found for id " # id.toText()) };
      case (?existingListing) {
        let updatedListing : SellerListing = {
          existingListing with
          status
        };
        sellerListings.add(id, updatedListing);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteSellerListing(id : Nat) : async Bool {
    switch (sellerListings.get(id)) {
      case (null) { Runtime.trap("Delete failed: SellerListing not found for id " # id.toText()) };
      case (?existingListing) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or (existingListing.sellerId == caller))) {
          Runtime.trap("Unauthorized: Only admins or the owner can delete this listing");
        };
        sellerListings.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func registerSellerProfile(
    storeName : Text,
    description : Text,
    contactEmail : Text,
    contactWhatsApp : Text,
    logoUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register seller profiles");
    };
    let newProfile : SellerProfile = {
      sellerId = caller;
      storeName;
      description;
      contactEmail;
      contactWhatsApp;
      logoUrl;
      createdAt = Time.now();
    };
    sellerProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getMySellerProfile() : async ?SellerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    sellerProfiles.get(caller);
  };

  public query ({ caller }) func getSellerProfile(seller : Principal) : async ?SellerProfile {
    sellerProfiles.get(seller);
  };

  public query ({ caller }) func getAllSellerProfiles() : async [SellerProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all seller profiles");
    };
    sellerProfiles.values().toArray();
  };

  // ------------ Orders API ----------------------------------------------------------------------------------------

  public shared ({ caller }) func placeOrder(
    customerName : Text,
    customerEmail : Text,
    customerPhone : Text,
    customerAddress : Text,
    productId : Nat,
    productTitle : Text,
    orderType : OrderType,
    sellerListingId : ?Nat,
    quantity : Nat,
    sellingPrice : Float,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can place orders");
    };

    orderCounter += 1;

    let newOrder : Order = {
      id = orderCounter;
      customerId = caller;
      customerName;
      customerEmail;
      customerPhone;
      customerAddress;
      productId;
      productTitle;
      orderType;
      sellerListingId;
      quantity;
      sellingPrice;
      status = #pending;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    orders.add(orderCounter, newOrder);

    orderCounter;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their orders");
    };
    let filteredOrders = List.empty<Order>();
    for ((id, order) in orders.entries()) {
      if (order.customerId == caller) {
        filteredOrders.add(order);
      };
    };
    filteredOrders.values().toArray();
  };

  public query ({ caller }) func getOrderById(id : Nat) : async ?Order {
    switch (orders.get(id)) {
      case (null) {
        null;
      };
      case (?order) {
        if (order.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only order owner or admin can access order");
        };
        ?order;
      };
    };
  };

  public query ({ caller }) func getAllOrdersAdmin() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : OrderStatus) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Update failed: Order not found for id " # id.toText()) };
      case (?order) {
        let updatedOrder : Order = {
          order with
          status;
          updatedAt = Time.now();
        };
        orders.add(id, updatedOrder);
        true;
      };
    };
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders by status");
    };

    let filteredOrders = List.empty<Order>();
    for ((id, order) in orders.entries()) {
      if (order.status == status) {
        filteredOrders.add(order);
      };
    };
    filteredOrders.values().toArray();
  };
};
