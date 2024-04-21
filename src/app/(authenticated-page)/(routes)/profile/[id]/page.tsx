function UserProfile({ params }: any) {
  return (
    <div>
      <h1>Profile Page</h1>
      <hr />
      <h2>Profile</h2>
      <p>username: {params.id}</p>
    </div>
  );
}
export default UserProfile;
