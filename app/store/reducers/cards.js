import ACTION_TYPES from 'Store/actions/actionTypes';
import unNest from 'Utils/nest';
import uniqid from 'uniqid';

const {
  ADD_CARD,
  REMOVE_CARD,
  TOGGLE_CARD,
  SAVE_CARD,
  CHANGE_CARD_SETTING,
  DISCARD_CHANGES,
  EDIT_CARD,
  CHANGE_TITLE,
  UPDATE_CARD_LIST,
} = ACTION_TYPES.CARD;

// const saveId = (card, cardList) => card.id || addId(cardList);

const cardTitle = action => unNest(action, 'card.title') || 'Untitled Card';
export default function cards(state = [], action) {
  switch (action.type) {
    case UPDATE_CARD_LIST:
      return [...action.content];
    case ADD_CARD:
      return [
        ...state,
        {
          ...action.card,
          title: cardTitle(action),
          lastEditDate: new Date(),
          id: uniqid(),
          archived: false,
        },
      ];
    case REMOVE_CARD:
      return state.filter(card => card.id !== action.card.id);
    case CHANGE_CARD_SETTING:
      return state.map((card) => {
        if (card.id === action.cardId) {
          const newCard = { ...card };
          newCard[action.prop] = action.value;
          return newCard;
        }
        return card;
      });
    case DISCARD_CHANGES:
      return state.map((card) => {
        if (card.id === action.card.id) {
          const cardId = String(card.id).length < 5 ? uniqid() : card.id;
          return {
            ...action.card,
            id: cardId,
            isEditing: false,
            text: action.card.text,
            title: action.card.title,
          };
        }
        return card;
      });

    case SAVE_CARD:
      return state.map((card) => {
        if (card.id === action.card.id) {
          const cardId = String(card.id).length < 5 ? uniqid() : card.id;
          return {
            ...action.card,
            id: cardId,
            lastEditDate: new Date(),
            isEditing: false,
            text: action.card.editingText,
            title: action.card.editingTitle,
            editingText: '',
            editingTitle: '',
          };
        }
        return card;
      });
    case CHANGE_TITLE:
      return state.map((card) => {
        if (card.id === action.card.id) {
          return {
            ...card,
            title: action.payload,
          };
        }
        return card;
      });
    case TOGGLE_CARD:
      return state.map((card) => {
        if (card.id === action.card.id) {
          return {
            ...card,
            completed: !card.completed && !card.archived,
          };
        }
        return card;
      });
    case EDIT_CARD:
      return state.map((card) => {
        if (card.id === action.card.id) {
          const cardId = String(card.id).length < 5 ? uniqid() : card.id;
          return {
            ...action.card,
            id: cardId,
            isEditing: true,
            editingText: card.text,
            editingTitle: card.title,
          };
        }
        return { ...card, isEditing: false };
      });
    /*
    case GENERATE_LINK:
      return state.map((card) => {
        if (card.id === action.index) {
          return {
            ...card,
            id: action.keys.id,
            shortLink: action.keys.shortLink,
          };
        }
        return card;
      });
      */
    default:
      return state;
  }
}
