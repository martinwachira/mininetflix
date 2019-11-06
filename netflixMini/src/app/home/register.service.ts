import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IMovie } from './../movies/movie';
import { catchError, tap, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  // private dbPath = '/movies';
  // moviesRef: AngularFireList<IMovie> = null;

  movieCollection: AngularFirestoreCollection<IMovie>;
  movies: Observable<IMovie[]>;
  movieDoc: AngularFirestoreDocument<IMovie>;

  // movie: IMovie = {
  //   id: '',
  //   title: '',
  //   author: '',
  //   director: '',
  //   awards: '',
  //   language: '',
  //   genre: '',
  //   plot: '',
  //   releaseDate: '',
  //   description: '',
  //   rating: '',
  //   imgUrl: ''
  // }

  constructor(private http: HttpClient, public fs: AngularFirestore, private db: AngularFireDatabase) {
    // this.moviesRef = db.list(this.dbPath);

    this.movieCollection = this.fs.collection('movies', ref => ref.orderBy('title', 'asc'));

    this.movies = this.movieCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as IMovie;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }


  // getAllMovies(): Observable<any>{
  //   return this.fs.collection('movies').snapshotChanges();
  // }


  getAllMovies() {
    return this.movies;
  }

  getMovie(id: string): Observable<IMovie | undefined>{
    return this.getAllMovies()
    .pipe(
        map((movies: IMovie[]) => movies.find(m => m.id === id))
    );
  }

  // getMovie(id: IMovie) {
  //   this.movieDoc = this.fs.doc(`movies/${id}`);
  //   // this.movieDoc.update(movie);
  // }


  // getMovie(id: string) {
  //   const mov = this.fs.collection<IMovie[]>('movies');
  //   return mov.valueChanges()
  //   // return this.getAllMovies()
  //   .pipe(
  //     map((mov) => {
  //       return mov.find(mo => mo.id === id);
  //     })
  //   )
  // }

  // getMovie = (id: string) => {
  //   return this.fs.collection(this.dbPath).snapshotChanges();//..snapshotChanges();
  //  } 

  // getMovie(title: string): Observable<IMovie>{
  //   return this.http.get(this.dbPath)
  //   .pipe(
  //       map((response) => 
  //       <IMovie>response)
  //   );
  // }


  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An Error Occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server Returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }


  submitRegister(body: any) {
    return this.http.post('http://localhost:3000/users/register', body, {
      observe: 'body'
    });
  }

  login(body: any) {
    return this.http.post('http://localhost:3000/users/login', body, {
      observe: 'body'
    });
  }

  getUserName() {
    return this.http.get('http://localhost:3000/users/username', {
      observe: 'body',
      params: new HttpParams().append('token', localStorage.getItem('token'))
    });

  }

}
