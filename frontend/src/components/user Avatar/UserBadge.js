import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";



//this component would be used to show the added users in the CREATE GrOUP CHAT BAR under  the searched name Input Box
//while adding users to the group during creating the grouip chat
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
//full code review done