// import React, { useEffect, useState } from 'react';

// import 'emoji-mart/css/emoji-mart.css';
// import { Picker, emojiIndex } from 'emoji-mart';

// /**
//  * Provides an Emoji Picker
//  *
//  * @param param0
//  * @returns
//  */
// const EmojiPicker = ({ search }) => {
//   // const [emojiSearch, setEmojiSearch] = useState("");
//   const [emojiList, setEmojiList] = useState<any[]>([]);

//   useEffect(() => {
//     if (search === []) setEmojiList(null);
//     setEmojiList(emojiIndex.search(search));
//   }, [search]);

//   const handleKeyDown = (event) => {
//     // if (event.key === "Enter") {
//     //   setEmojiSearch(emojiList ? emojiList[0].native : null);
//     // }
//   };

//   return (
//     <div className="flex flex-row absolute">
//       {emojiList &&
//         emojiList
//           .slice(0, 10)
//           .map((e, i) => <p key={`emoji-${i}`}>{e.native}</p>)}
//     </div>
//   );
// };

// export default EmojiPicker;
