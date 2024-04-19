import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Booking} from "../../models/Booking";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  path: string = 'Bookings';

  constructor(private afs: AngularFirestore) {
  }

  create(booking: Booking) {
    return this.afs.collection<Booking>(this.path).doc(booking.id).set(booking);
  }

  createId() {
    return this.afs.createId();
  }

  getAllByUID(UID: string) {
    return this.afs.collection<Booking>(this.path, ref => ref.where('UID', '==', UID)).valueChanges();
  }

  getBookingByDate(date: string) {
    return this.afs.collection<Booking>(this.path, ref => ref.where('date', '==', date)).valueChanges();
  }

  delete(id: string) {
    return this.afs.collection<Booking>(this.path).doc(id).delete();

  }
}
