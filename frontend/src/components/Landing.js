function Landing() {
  return (
    <div className="content">
      <h2>Welcome to Auction App</h2>
      <p>
        An auction is a process of buying and selling goods or services by
        offering them up for bids, taking bids, and selling the item to the
        highest bidder. Some exceptions to this definition exist and are
        described in different auction types.
      </p>

      <h2>How Auctions Work?</h2>
      <ul>
        <li>Item Listing – Sellers list items with descriptions, images, and starting bid prices.</li>
        <li>Bidding Process – Buyers place bids within a set timeframe.</li>
        <li>Winning Bid – The highest bid wins at the end of the auction.</li>
        <li>Payment & Delivery – The buyer completes the payment, and the seller ships or delivers the item.</li>
      </ul>

      <h2>Terms & Conditions</h2>

      <h3>1. User Eligibility</h3>
      <ul>
        <li>Users must be at least 18 years old.</li>
        <li>Registration requires valid identification and payment details.</li>
      </ul>

      <h3>2. Bidding Rules</h3>
      <ul>
        <li>All bids placed are final and cannot be withdrawn.</li>
        <li>The highest bid at auction close wins the item.</li>
      </ul>

      <h3>3. Seller Responsibilities</h3>
      <ul>
        <li>Sellers must provide accurate descriptions and images of their items.</li>
      </ul>

      <h3>4. Auction Cancellations & Disputes</h3>
      <ul>
        <li>The platform reserves the right to cancel suspicious or fraudulent auctions.</li>
        <li>Disputes should be reported within 48 hours after auction closure.</li>
      </ul>

      <h3>5. Privacy & Security</h3>
      <ul>
        <li>User data is protected according to our Privacy Policy.</li>
      </ul>

      <p>
        The platform reserves the right to update these terms as necessary.
        <br />
        By participating in auctions, you agree to abide by these terms.
      </p>
    </div>
  );
}

export default Landing;
