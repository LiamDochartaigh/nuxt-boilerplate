import { Schema, model } from 'mongoose';

export interface IUser {
  authType: string;
  email: string;
  password: string;
  role: string;
  email_confirmed: boolean;
  confirmation_token?: string;
  confirmation_token_expires?: Date;
  access_token: string;
  refresh_token: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  user_avatar_URL: string;
}

const UserSchema = new Schema<IUser>({
  authType: {
    type: String,
    default: "local",
    required: true,
    enum: ["local", "google"]
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: "user"
  },
  email_confirmed: {
    type: Boolean,
    default: false
  },
  confirmation_token: {
    type: String,
    default: "",
  },
  confirmation_token_expires: {
    type: Date,
    default: '',
  },
  access_token: {
    type: String,
    default: "",
  },
  refresh_token: {
    type: String,
    default: "",
  },
  password_reset_token: {
    type: String,
    default: "",
  },
  password_reset_expires: {
    type: Date,
    default: '',
  },
  user_avatar_URL: {
    type: String,
    default: ''
  }
}, { timestamps: true });

UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    delete ret.password;
    delete ret.confirmation_token;
    delete ret.confirmation_token_expires;
    delete ret.access_token;
    delete ret.refresh_token;
    delete ret.password_reset_token;
    delete ret.password_reset_expires;
    delete ret.authType;
    return ret;
  }
});

const User = model<IUser>("User", UserSchema);
export default User;