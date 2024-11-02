import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Int "mo:base/Int";

actor class StreetAnimals() {
    // Hayvan veri tipi
    public type Animal = {
        id: Nat;
        species: Text; // kedi, köpek vs.
        location: Text;
        health_status: Text;
        needs_help: Bool;
        reporter: Text;
        date_reported: Text;
        photo_url: Text;
    };

    private stable var nextId: Nat = 0;
    
    // Hayvanları depolamak için HashMap
    private var animals = HashMap.HashMap<Nat, Animal>(0, Nat.equal, Hash.hash);

    // Timestamp'i okunabilir tarih formatına çevirme
    private func timestampToString(timestamp: Int): Text {
        let milliseconds = timestamp / 1_000_000; // Nanosaniyeden milisaniyeye çevirme
        Int.toText(milliseconds)
    };

    // Yeni hayvan raporu ekleme
    public shared(msg) func reportAnimal(
        species: Text,
        location: Text,
        health_status: Text,
        needs_help: Bool,
        photo_url: Text
    ): async Nat {
        let id = nextId;
        nextId += 1;

        let animal: Animal = {
            id;
            species;
            location;
            health_status;
            needs_help;
            reporter = Principal.toText(msg.caller);
            date_reported = timestampToString(Time.now());
            photo_url;
        };

        animals.put(id, animal);
        id
    };

    // Tüm hayvanları getirme
    public query func getAllAnimals(): async [Animal] {
        Iter.toArray(animals.vals())
    };

    // ID'ye göre hayvan getirme
    public query func getAnimal(id: Nat): async ?Animal {
        animals.get(id)
    };

    // Hayvan durumunu güncelleme
    public shared(msg) func updateAnimalStatus(id: Nat, new_status: Text, needs_help: Bool): async Bool {
        switch (animals.get(id)) {
            case null { false };
            case (?animal) {
                let updated_animal: Animal = {
                    id = animal.id;
                    species = animal.species;
                    location = animal.location;
                    health_status = new_status;
                    needs_help = needs_help;
                    reporter = Principal.toText(msg.caller);
                    date_reported = animal.date_reported;
                    photo_url = animal.photo_url;
                };
                animals.put(id, updated_animal);
                true
            };
        }
    };
}